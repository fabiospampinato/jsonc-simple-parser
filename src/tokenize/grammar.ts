
/* IMPORT */

import {ParseTokensMap, ParseMatchersMap} from '../types';
import Utils from '../utils';

/* GRAMMAR */

const grammar = ( tokens: ParseTokensMap ) => {

  /* MATCHERS */

  const $ = Utils.tokens2matchers <ParseTokensMap, ParseMatchersMap> ( tokens );

  /* EARLY RETURN */

  const EarlyReturn
    = $.EarlyReturn`${''}`;

  /* INSUFFICIENT */

  const Insufficient
    = $.Insufficient`${/[^]?/}`;

  /* INVALID */

  const Invalid
    = $.Invalid`${/[^]/}`;

  /* TRIVIA */

  const Newline
    = $.Newline`${/\r?\n|\r/}`;

  const Whitespace
    = $.Whitespace`${/[ \t]+/}`;

  const CommentLine
    = $.CommentLine`${/\/\/.*/}`;

  const CommentBlock
    = $.CommentBlock`${/\/\*[^]*?\*\//}`;

  const Trivia
    = $.Passthrough`${Newline} | ${Whitespace} | ${CommentLine} | ${CommentBlock}`;

  /* _ */

  const _Separated
    = $.Passthrough`${Trivia}*`;

  const _Merged
    = $.Whitespace`${/(?:[ \t\r\n]+|\/\/.*|\/\*[^]*?\*\/)*/}`;

  const _ = $.Newline === $.Whitespace && $.Whitespace === $.CommentLine && $.CommentLine === $.CommentBlock ? _Merged : _Separated;

  /* COMMA */

  const Comma
    = $.Comma`${','}`;

  const CommaTrailing
    = $.CommaTrailing`${','}`;

  /* COLON */

  const Colon
    = $.Colon`${':'}`;

  /* NULL */

  const Null
    = $.Null`${'null'}`;

  /* BOOLEAN */

  const True
    = $.True`${'true'}`;

  const False
    = $.False`${'false'}`;

  const Boolean
    = $.Passthrough`${True} | ${False}`;

  /* NUMBER */

  const Number
    = $.Number`${/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?/}`;

  /* STRING */

  const String
    = $.String`${/"(?:[^\u0000-\u001F\\"]+|\\["bfnrt\\/]|\\u[0-9a-fA-F]{4})*"/}`;

  /* ARRAY */

  const ArrayOpen
    = $.ArrayOpen`${'['}`;

  const ArrayClose
    = $.ArrayClose`${']'}`;

  const ArrayMember
    = $.Passthrough`${_} ${() => Literal} ${_}`;

  const ArrayMembers
    = $.Passthrough`${ArrayMember} (!${EarlyReturn} ${Comma} ${ArrayMember})* ${CommaTrailing}?`;

  const Array
    = $.Array`${ArrayOpen} ${_} ${ArrayMembers}? ${_} (${EarlyReturn} | ${ArrayClose})`;

  /* OBJECT */

  const ObjectOpen
    = $.ObjectOpen`${'{'}`;

  const ObjectClose
    = $.ObjectClose`${'}'}`;

  const ObjectMember
    = $.Passthrough`${_} ${String} (${EarlyReturn} | ${_} ${Colon} ${_} ${() => Literal} ${_})`;

  const ObjectMembers
    = $.Passthrough`${ObjectMember} (!${EarlyReturn} ${Comma} ${ObjectMember})* ${CommaTrailing}?`;

  const Object
    = $.Object`${ObjectOpen} ${_} ${ObjectMembers}? ${_} (${EarlyReturn} | ${ObjectClose})`;

  /* LITERAL */

  const Literal
    = $.Passthrough`${Null} | ${Boolean} | ${Number} | ${String} | ${Object} | ${Array}`;

  /* ROOT */

  const Root
    = $.Root`${_} (${Literal} | ${Insufficient}) (${EarlyReturn} | ${_} ${Invalid}?)`;

  /* RETURN */

  return Root;

};

/* EXPORT */

export default grammar;
