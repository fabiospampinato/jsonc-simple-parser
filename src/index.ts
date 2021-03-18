
/* IMPORT */

import detokenize from './detokenize';
import lookup from './lookup';
import parse from './parse';
import stringify from './stringify';
import strip from './strip';
import tokenize from './tokenize';

/* EXPORT */

const JSONC = {
  ast: {
    parse: tokenize,
    stringify: detokenize
  },
  lookup,
  parse,
  stringify,
  strip
};

/* EXPORT */

export default JSONC;
