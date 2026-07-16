import { writeFileSync } from 'node:fs';
import { minify } from 'oxc-minify';
import { build } from 'rolldown';

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

const bundled = chunk.code;
const { code: minified } = minify('prelude.cjs', bundled, { compress: true });
const prelude = [
  'var module = {}, exports = {};',
  minified,
  'JSON.parse = module.exports.default.parse;',
  'JSON.stringify = module.exports.default.stringify;'
].join('\n');

writeFileSync('test/test262/prelude.js', prelude);
