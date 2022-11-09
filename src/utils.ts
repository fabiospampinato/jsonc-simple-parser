
/* IMPORT */

import {match} from 'reghex';
import type {DelimiterToken, IgnoredToken, LiteralToken, Token, ParseTokensMap, LookupToken} from './types';

/* MAIN */

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

  tokens2matchers: <Tokens extends ParseTokensMap, Matchers> ( tokens: Tokens ): Matchers => {

    const cache = new Map ();

    return Object.keys ( tokens ).reduce ( ( acc, type ) => {

      const transformer = tokens[type];

      const matcher = transformer.unwrapped ? transformer : cache.get ( transformer ) || match ( type, transformer );

      cache.set ( transformer, matcher );

      acc[type] = matcher;

      return acc;

    }, {} as Matchers );

  }

};

/* EXPORT */

export default Utils;
