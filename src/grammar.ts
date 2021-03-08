
/* IMPORT */

import {match} from 'reghex';

/* GRAMMAR */

//URL: https://github.com/pegjs/pegjs/blob/master/examples/json.pegjs
//URL: https://gist.githubusercontent.com/jordanbtucker/b398db00fa1e145d85bbe462914a994d/raw/b342692250b7a21e98aaab19e378645632eaf3b8/json5.pegjs

const grammar = () => {

  /* MATCHERS */

  const $ = match ( '', token => token.join ( '' ) ); // Pass every matched character unchanged

  const Void = match ( '', () => '' ); // Delete every matched character

  /* HELPERS */

  const Any
    = /[^]/;

  const Comma
    = ',';

  const CommaTrailing
    = Void`${/,?/}`;

  const _
    = Void`${/(?:[ \t\r\n]+|\/\/.*|\/\*[^]*?\*\/)*/}`; // Whitespace or comments

  /* NULL LITERAL */

  const NullLiteral
    = /null/;

  /* BOOLEAN LITERAL */

  const BooleanLiteral
    = /true|false/;

  /* NUMBER LITERAL */

  const NumberLiteral
    = /[-+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?/;

  /* STRING LITERAL */

  const StringLiteral
    = /"(?:[^\0-\x1F\\"]+|\\["bfnrt\\/]|\\u[0-9a-fA-F]{4})*"/;

  /* ARRAY LITERAL */

  const ArrayDelimiterStart
    = '[';

  const ArrayDelimiterEnd
    = ']';

  const ArrayMember
    = () => Literal;

  const ArrayMembers
    = $`${ArrayMember} (${Comma} ${ArrayMember})* ${CommaTrailing}`;

  const ArrayLiteral
    = $`${ArrayDelimiterStart} ${_} ${ArrayMembers}? ${_} ${ArrayDelimiterEnd}`;

  /* OBJECT LITERAL */

  const ObjectDelimiterStart
    = '{';

  const ObjectDelimiterEnd
    = '}';

  const ObjectNameSeparator
    = ':';

  const ObjectMember
    = $`${_} ${StringLiteral} ${_} ${ObjectNameSeparator} ${_} ${() => Literal}`;

  const ObjectMembers
    = $`${ObjectMember} (${Comma} ${ObjectMember})* ${CommaTrailing}`;

  const ObjectLiteral
    = $`${ObjectDelimiterStart} ${_} ${ObjectMembers}? ${_} ${ObjectDelimiterEnd}`;

  /* LITERAL */

  const Literal
    = $`${_} (${NullLiteral} | ${BooleanLiteral} | ${NumberLiteral} | ${StringLiteral} | ${ObjectLiteral} | ${ArrayLiteral}) ${_}`;

  /* ROOT */

  const Root
    = $`${Literal} !${Any}`;

  /* RETURN */

  return Root;

};

/* EXPORT */

export default grammar;
