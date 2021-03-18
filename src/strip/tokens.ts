
/* IMPORT */

import Context from './context';
import {StripTokensMap} from '../types';

/* TOKENS */

const Tokens: StripTokensMap = {
  Insufficient: ( values: [string] ): never => {
    if ( values[0].length ) Tokens.Invalid ( values );
    throw new SyntaxError ( 'Unexpected end of JSONC input' );
  },
  Invalid: ( values: [string] ): never => {
    throw new SyntaxError ( `Unexpected token ${values[0]} in JSONC at position ${Context.offset}` );
  },
  Delete: ( values: [string] ): string => {
    Context.offset += values[0].length;
    return '';
  },
  Passthrough: ( values: string[] ): string => {
    const source = values.join ( '' );
    Context.offset += source.length;
    return source;
  }
};

/* EXPORT */

export default Tokens;
