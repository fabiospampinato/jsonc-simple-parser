
/* IMPORT */

import {StripTokensMap, StripMatchersMap} from '../types';
import Utils from '../utils';

/* GRAMMAR */

const grammar = ( tokens: StripTokensMap ) => {

  /* MATCHERS */

  const $ = Utils.tokens2matchers <StripTokensMap, StripMatchersMap> ( tokens );

  /* INSUFFICIENT */

  const Insufficient
    = $.Insufficient`${/[^]?/}`;

  /* INVALID */

  const Invalid
    = $.Invalid`${/[^]/}`;

  /* TRIVIA */

  const _
    = $.Delete`${/(?:[ \t\r\n]+|\/\/.*|\/\*[^]*?\*\/)*/}`; // Whitespace, newlines or comments

  /* COMMA */

  const Comma
    = ',';

  const CommaTrailing
    = $.Delete`${','}`;

  /* COLON */

  const Colon
    = ':';

  /* NULL */

  const Null
    = /null/;

  /* BOOLEAN */

  const Boolean
    = /true|false/;

  /* NUMBER */

  const Number
    = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?/;

  /* STRING */

  const String
    = /"(?:[^\u0000-\u001F\\"]+|\\["bfnrt\\/]|\\u[0-9a-fA-F]{4})*"/;

  /* ARRAY */

  const ArrayOpen
    = '[';

  const ArrayClose
    = ']';

  const ArrayMember
    = $.Passthrough`${_} ${() => Literal} ${_}`;

  const ArrayMembers
    = $.Passthrough`${ArrayMember} (${Comma} ${ArrayMember})* ${CommaTrailing}?`;

  const Array
    = $.Passthrough`${ArrayOpen} ${_} ${ArrayMembers}? ${_} ${ArrayClose}`;

  /* OBJECT */

  const ObjectOpen
    = '{';

  const ObjectClose
    = '}';

  const ObjectMember
    = $.Passthrough`${_} ${String} ${_} ${Colon} ${_} ${() => Literal} ${_}`;

  const ObjectMembers
    = $.Passthrough`${ObjectMember} (${Comma} ${ObjectMember})* ${CommaTrailing}?`;

  const Object
    = $.Passthrough`${ObjectOpen} ${_} ${ObjectMembers}? ${_} ${ObjectClose}`;

  /* LITERAL */

  const Literal
    = $.Passthrough`${Null} | ${Boolean} | ${Number} | ${String} | ${Object} | ${Array}`;

  /* ROOT */

  const Root
    = $.Passthrough`${_} (${Literal} | ${Insufficient}) ${_} ${Invalid}?`;

  /* RETURN */

  return Root;

};

/* EXPORT */

export default grammar;
