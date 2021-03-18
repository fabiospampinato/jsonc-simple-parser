
/* IMPORT */

import {match} from 'reghex';
import {DelimiterToken, IgnoredToken, LiteralToken, Token, LookupToken} from './types';

/* UTILS */

const Utils = {

  /* VARIABLES */

  tokenDelimiterTypes: new Set ([ 'ArrayOpen', 'ArrayClose', 'ObjectOpen', 'ObjectClose' ]),
  tokenIgnoredTypes: new Set ([ 'Newline', 'Whitespace', 'CommentLine', 'CommentBlock', 'Comma', 'CommaTrailing', 'Colon' ]),
  tokenLiteralTypes: new Set ([ 'Null', 'True', 'False', 'Number', 'String', 'Array', 'Object' ]),

  /* API */

  isEven: ( number: number ): boolean => {

    return !( number % 2 );

  },

  isOdd: ( number: number ): boolean => {

    return !Utils.isEven ( number );

  },

  isString: ( value: any ): value is string => {

    return typeof value === 'string';

  },

  isToken: ( value: Token | string ): value is Token => {

    return !Utils.isString ( value );

  },

  isTokenDelimiter: ( token: Token | LookupToken ): token is DelimiterToken => {

    return Utils.tokenDelimiterTypes.has ( token.type );

  },

  isTokenIgnored: ( token: Token | LookupToken ): token is IgnoredToken => {

    return Utils.tokenIgnoredTypes.has ( token.type );

  },

  isTokenLiteral: ( token: Token | LookupToken ): token is LiteralToken => {

    return Utils.tokenLiteralTypes.has ( token.type );

  },

  tokens2matchers: <Tokens, Matchers> ( tokens: Tokens ): Matchers => {

    return Object.keys ( tokens ).reduce ( ( acc, type ) => ( acc[type] = match ( type, tokens[type] ) ) && acc, {} );

  }

};

/* EXPORT */

export default Utils;
