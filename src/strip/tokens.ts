
/* IMPORT */

import {StripTokensMap} from '../types';

/* TOKENS */

const Tokens: StripTokensMap = {
  Insufficient: ( values: [string] ): never => {
    if ( values[0].length ) Tokens.Invalid ( values );
    throw new SyntaxError ( 'Unexpected end of JSONC input' );
  },
  Invalid: ( values: [string] ): never => {
    throw new SyntaxError ( `Unexpected token ${values[0]} in JSONC` );
  },
  Delete: (): string => {
    return '';
  },
  Passthrough: ( values: string[] ): string => {
    return values.join ( '' );
  }
};

/* EXPORT */

export default Tokens;
