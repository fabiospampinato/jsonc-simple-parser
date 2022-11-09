
/* IMPORT */

import type {ParseTokensMap} from '../types';
import Context from '../tokenize/context';
import TokenizeTokens from '../tokenize/tokens';

/* HELPERS */

const Delete = ( values: [string] ): string => {
  Context.offset += values[0].length;
  return '';
};

const Passthrough = ( values: string[] ): string => {
  const source = values.join ( '' );
  Context.offset += source.length;
  return source;
};

const Unwrapped = ( quasis: string[], token: RegExp | string ): RegExp | string => {
  return token;
};

Unwrapped.unwrapped = true;

/* MAIN */

const Tokens: ParseTokensMap = {
  ...TokenizeTokens,
  Passthrough,
  Newline: Delete,
  Whitespace: Delete,
  CommentLine: Delete,
  CommentBlock: Delete,
  Comma: Unwrapped,
  CommaTrailing: Delete,
  Colon: Unwrapped,
  Null: Unwrapped,
  True: Unwrapped,
  False: Unwrapped,
  Number: Unwrapped,
  String: Unwrapped,
  ArrayOpen: Unwrapped,
  ArrayClose: Unwrapped,
  Array: Passthrough,
  ObjectOpen: Unwrapped,
  ObjectClose: Unwrapped,
  Object: Passthrough,
  Root: Passthrough
};

/* EXPORT */

export default Tokens;
