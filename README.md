# JSONC Simple Parser

A simple JSON parser that supports comments and optional trailing commas.

## Features

- **Tiny**:
  - It's ~2.1kb minified and gzipped, if you aren't already using [RegHex](https://github.com/kitten/reghex), otherwise it's just ~.5kb.
  - Even if you aren't using [RegHex](https://github.com/kitten/reghex) already (you should) that's ~60% smaller than VS Code's [jsonc-parser](https://www.npmjs.com/package/jsonc-parser) and ~80% smaller than [JSON5](https://www.npmjs.com/package/json5).
- **Performant**:
  - When parsing regular JSON it's ~10x faster than VS Code's [jsonc-parser](https://www.npmjs.com/package/jsonc-parser), ~70x faster than [JSON5](https://www.npmjs.com/package/json5) and just as fast as the native `JSON.parse`.
  - When parsing JSON with comments or trailing commas it's just as fast as VS Code's [jsonc-parser](https://www.npmjs.com/package/jsonc-parser) and ~6x faster than [JSON5](https://www.npmjs.com/package/json5).
- **Tested**:
  - It passes all 144 tests regarding JSON from ECMA's [test262](https://github.com/tc39/test262) test suite.
  - The parser is obviously not spec compliant but this means that while adding support for comments and trailing commas probably nothing else got broken.

## Install

```sh
npm install --save jsonc-simple-parser
```

## Usage

```ts
import JSONC from 'jsonc-simple-parser';

const source = `
  { // This is an example
    "foo": 123,
    /* TRAILING COMMAS */
    "bar": [1, 2, 3,],
  }
`;

const result = {
  foo: 123,
  bar: [1, 2, 3]
};

JSONC.parse ( source ); // => returns an object that's deeply equal to `result`
JSONC.stringify ( result ); // => same as calling `JSON.stringify`
```

## License

MIT © Fabio Spampinato
