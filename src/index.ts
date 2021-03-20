
/* IMPORT */

import detokenize from './detokenize';
import lookup from './lookup';
import parse from './parse';
import stringify from './stringify';
import strip from './strip';
import tokenize from './tokenize';
import validate from './validate';

/* EXPORT */

const JSONC = {
  ast: {
    parse: tokenize,
    stringify: detokenize
  },
  lookup,
  parse,
  stringify,
  strip,
  validate
};

/* EXPORT */

export default JSONC;
