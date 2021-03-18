
/* IMPORT */

import {Token, LookupToken} from './types';

/* DETOKENIZE */

const detokenize = ( token: Token | LookupToken ): string => {

  if ( 'source' in token ) return token.source;

  return token.children.map ( detokenize ).join ( '' );

};

/* EXPORT */

export default detokenize;
