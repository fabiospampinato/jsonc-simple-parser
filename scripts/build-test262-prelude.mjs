import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { minifySync } from 'oxc-minify';
import { build } from 'rolldown';

export async function buildTest262Prelude(outputPath = 'test/test262/prelude.js') {
  const { output } = await build({
    input: 'dist/index.js',
    platform: 'node',
    output: {
      format: 'cjs',
      minify: false
    }
  });

  const chunk = output.find(file => file.type === 'chunk');

  if (!chunk) {
    throw new Error('Failed to bundle dist/index.js for test262 prelude');
  }

  const { code: minified, errors } = minifySync('prelude.cjs', chunk.code, { compress: true });

  if (errors.length) {
    throw new Error(`Failed to minify test262 prelude: ${errors.map(error => error.message).join(', ')}`);
  }

  const prelude = [
    'var module = {}, exports = {};',
    '(function () {',
    minified,
    '})();',
    'JSON.parse = module.exports.parse;',
    'JSON.stringify = module.exports.stringify;'
  ].join('\n');

  writeFileSync(resolve(outputPath), prelude);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  await buildTest262Prelude();
}
