import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execPath } from 'node:process';
import minimatch from 'minimatch';
import Test262Stream from 'test262-stream';

const DEFAULT_TIMEOUT = 10000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeRuntime = readFileSync(join(__dirname, 'test262-node-runtime.js'), 'utf8');

const args = process.argv.slice(2);
let threads = 1;
let preludePath;
const patterns = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '-t' || arg === '--threads') {
    threads = Number(args[++i]);
    continue;
  }

  if (arg === '--prelude') {
    preludePath = args[++i];
    continue;
  }

  if (arg.startsWith('-')) {
    continue;
  }

  patterns.push(arg);
}

if (!patterns.length) {
  console.error('Usage: node test/runners/test262-run.mjs [-t threads] --prelude <file> <test-glob> [...]');
  process.exit(1);
}

const preludeContents = preludePath ? readFileSync(preludePath, 'utf8') : '';
const test262Dir = findTest262Root(patterns[0]);
const test262Version = JSON.parse(readFileSync(join(test262Dir, 'package.json'), 'utf8')).version;
const globPatterns = patterns.map(pattern => relative(test262Dir, resolve(pattern)).split(sep).join('/'));
const paths = patternsToDirectories(globPatterns);
const stream = new Test262Stream(test262Dir, { paths, acceptVersion: test262Version });

function inception(runtime) {
  return runtime.replace('$SOURCE', JSON.stringify(runtime.replace('$SOURCE', '""')));
}

function compileForNode(code) {
  const runtime = inception(nodeRuntime.replace(/\r?\n/g, '').replace(/\s+/gm, ' '));
  const prologue = code.match(/^("[^\r\n"]*"|'[^\r\n']*'|[\s\r\n;]*|\/\*[\w\W]*?\*\/|\/\/[^\n]*\n)*/);
  const withRuntime = prologue ? prologue[0] + runtime + code.slice(prologue[0].length) : runtime + code;
  const withDestroy = `${withRuntime}\n;$262.destroy();`;

  const escaped = JSON.stringify(withDestroy)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `
Function("return this;")().require = require;
var vm = require("vm");
var eshostContext = vm.createContext({
  setTimeout,
  require,
  console,
  print(...args) {
    console.log(...args);
  }
});
vm.runInESHostContext = function(code, options) {
  return vm.runInContext(code, eshostContext, options);
};
vm.runInESHostContext(${escaped});
`;
}

function parseError(str) {
  const errorRe = /^[\w\d]+(:.*)?(?:(\r?\n\s+at.*)+|\r?\n$)/m;
  const errorPropsRe = /^([\w\d]+)(: (.*))?\r?\n/;
  const match = str.match(errorRe);

  if (!match) {
    return null;
  }

  const errorStr = match[0];
  const props = errorStr.match(errorPropsRe);

  if (!props) {
    return null;
  }

  return {
    name: props[1],
    message: props[3],
  };
}

function validate(test) {
  const result = test.rawResult;
  const isNegative = test.attrs.flags.negative || test.attrs.negative;
  const isAsync = test.attrs.flags.async;
  let ranToFinish = isAsync ? result.stdout.indexOf('Test262:Async') > -1 : false;

  if (result.stderr) {
    ranToFinish = result.error ? true : false;
  } else if (!result.error && !result.stdout) {
    ranToFinish = true;
  }

  if (isAsync && !result.stdout && !result.stderr) {
    ranToFinish = false;
  }

  if (result.timeout) {
    return { pass: false, message: 'Test timed out' };
  }

  if (!isNegative) {
    if (result.error !== null) {
      if (result.error.name === 'Test262Error') {
        return { pass: false, message: result.error.message };
      }

      return {
        pass: false,
        message: `Expected no error, got ${result.error.name}: ${result.error.message}`,
      };
    }

    if (!ranToFinish && !test.attrs.flags.raw) {
      let message = result.stderr || result.stdout;

      if (isAsync && !message) {
        message = 'Test did not run to completion';
      }

      return { pass: false, message };
    }

    return { pass: true };
  }

  if (test.attrs.flags.negative) {
    return result.error ? { pass: true } : { pass: false, message: 'Expected test to throw some error' };
  }

  if (!result.error) {
    return {
      pass: false,
      message: `Expected test to throw error of type ${test.attrs.negative.type}, but did not throw error`,
    };
  }

  if (result.error.name === test.attrs.negative.type) {
    return { pass: true };
  }

  return {
    pass: false,
    message: `Expected test to throw error of type ${test.attrs.negative.type}, got ${result.error.name}: ${result.error.message}`,
  };
}

function runTest(contents, timeout) {
  const tempDir = mkdtempSync(join(tmpdir(), 'test262-'));
  const tempFile = join(tempDir, 'test.js');
  const code = compileForNode(contents);

  writeFileSync(tempFile, code);

  return new Promise(resolve => {
    const child = spawn(execPath, ['--expose-gc', tempFile], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeout);

    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });

    child.on('close', () => {
      clearTimeout(timer);
      unlinkSync(tempFile);

      const error = parseError(stderr);

      resolve({
        stdout,
        stderr,
        error,
        timeout: timedOut,
      });
    });
  });
}

function findTest262Root(path) {
  if (/\*/.test(path)) {
    return findTest262Root(resolve(path, '..'));
  }

  let current = resolve(path);

  try {
    if (statSync(current).isFile()) {
      current = dirname(current);
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }

    current = dirname(current);
  }

  while (true) {
    const contents = readdirSync(current);

    if (
      contents.includes('README.md') &&
      contents.includes('package.json') &&
      contents.includes('test') &&
      contents.includes('harness')
    ) {
      return current;
    }

    const parent = resolve(current, '..');

    if (parent === current) {
      throw new Error(`Unable to find test262 root from ${path}`);
    }

    current = parent;
  }
}

function patternsToDirectories(patterns) {
  return patterns
    .map(pattern => {
      const parts = [];

      pattern.split('/').every(part => {
        if (part.includes('*') || part.slice(-3).toLowerCase() === '.js') {
          return false;
        }

        parts.push(part);
        return true;
      });

      return `${parts.join('/')}/`;
    })
    .filter(name => name !== '')
    .filter((name, index, all) => all.every((other, otherIndex) => {
      if (name === other) {
        return index <= otherIndex;
      }

      const min = Math.min(name.length, other.length);

      if (name.slice(0, min) === other.slice(0, min)) {
        return name.length < other.length;
      }

      return true;
    }))
    .map(dir => dir.slice(0, -1));
}

async function collectTests() {
  const tests = [];

  await new Promise((resolvePromise, reject) => {
    stream.on('data', test => {
      if (!globPatterns.some(pattern => minimatch(test.file, pattern))) {
        return;
      }

      if (preludeContents && test.insertionIndex !== -1) {
        test.contents = test.contents.slice(0, test.insertionIndex) +
          preludeContents +
          test.contents.slice(test.insertionIndex);
      }

      test.file = relative(process.cwd(), join(test262Dir, test.file));
      tests.push(test);
    });

    stream.on('error', reject);
    stream.on('end', resolvePromise);
  });

  return tests;
}

async function runPool(tests, concurrency, timeout) {
  let index = 0;
  let passed = 0;
  let failed = 0;
  let lastPassed = true;

  function clearPassed() {
    if (!lastPassed) {
      return;
    }

    if (process.stdout.isTTY) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    } else {
      process.stdout.write('\n');
    }
  }

  async function worker() {
    while (index < tests.length) {
      const current = index++;
      const test = tests[current];
      test.rawResult = await runTest(test.contents, timeout);
      test.result = validate(test);

      if (test.result.pass) {
        passed++;
        clearPassed();
        lastPassed = true;
        process.stdout.write(`PASS ${test.file}`);
      } else {
        failed++;
        clearPassed();
        lastPassed = false;
        console.log(`FAIL ${test.file} (${test.scenario})`);
        console.log(`  ${test.result.message}`);
        console.log('');
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  clearPassed();
  console.log(`Ran ${passed + failed} tests`);
  console.log(`${passed} passed`);
  console.log(`${failed} failed`);

  return failed;
}

const tests = await collectTests();
const failed = await runPool(tests, threads, DEFAULT_TIMEOUT);

if (failed > 0) {
  process.exitCode = 1;
}
