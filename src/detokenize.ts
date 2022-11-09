
/* IMPORT */

import type {Token, LookupToken} from './types';

/* MAIN */

const detokenize = ( token: Token | LookupToken ): string => {

  if ( 'source' in token ) return token.source;

  return token.children.map ( detokenize ).join ( '' );

};

/* EXPORT */

export default detokenize;
