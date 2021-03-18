
/* HELPERS */

type JSONValue = import ( 'type-fest' ).JsonValue;

type Matcher = ( quasis: TemplateStringsArray, ...re: (string | RegExp | (() => string | RegExp))[] ) => any;

/* TOKENS */

type ChildToken = {
  type: string,
  source: string
};

type ParentToken = {
  type: string,
  children: Token[]
};

type NewlineToken = ChildToken & {
  type: 'Newline'
};

type WhitespaceToken = ChildToken & {
  type: 'Whitespace'
};

type CommentLineToken = ChildToken & {
  type: 'CommentLine'
};

type CommentBlockToken = ChildToken & {
  type: 'CommentBlock'
};

type CommaToken = ChildToken & {
  type: 'Comma'
};

type CommaTrailingToken = ChildToken & {
  type: 'CommaTrailing'
};

type ColonToken = ChildToken & {
  type: 'Colon'
};

type NullToken = ChildToken & {
  type: 'Null'
};

type TrueToken = ChildToken & {
  type: 'True'
};

type FalseToken = ChildToken & {
  type: 'False'
};

type NumberToken = ChildToken & {
  type: 'Number'
};

type StringToken = ChildToken & {
  type: 'String'
};

type ArrayOpenToken = ChildToken & {
  type: 'ArrayOpen'
};

type ArrayCloseToken = ChildToken & {
  type: 'ArrayClose'
};

type ArrayToken = ParentToken & {
  type: 'Array'
};

type ObjectOpenToken = ChildToken & {
  type: 'ObjectOpen'
};

type ObjectCloseToken = ChildToken & {
  type: 'ObjectClose'
};

type ObjectToken = ParentToken & {
  type: 'Object'
};

type RootToken = ParentToken & {
  type: 'Root'
};

/* TOKENS GROUPS */

type AbstractToken = ChildToken | ParentToken;
type IgnoredToken = TriviaToken | SeparationToken;
type LiteralToken = NullToken | TrueToken | FalseToken | NumberToken | StringToken | ArrayToken | ObjectToken;
type TriviaToken = NewlineToken | WhitespaceToken | CommentLineToken | CommentBlockToken;
type OpenToken = ArrayOpenToken | ObjectOpenToken;
type CloseToken = ArrayCloseToken | ObjectCloseToken;
type DelimiterToken = OpenToken | CloseToken;
type SeparationToken = CommaToken | CommaTrailingToken | ColonToken;
type SpecialToken = RootToken;
type Token = AbstractToken | LiteralToken | TriviaToken | DelimiterToken | SeparationToken | SpecialToken;
type AST = RootToken;

/* TOKENS MAPS */

type ParseTokensType = 'EarlyReturn' | 'Passthrough' | 'Insufficient' | 'Invalid' | 'Newline' | 'Whitespace' | 'CommentLine' | 'CommentBlock' | 'Comma' | 'CommaTrailing' | 'Colon' | 'Null' | 'True' | 'False' | 'Number' | 'String' | 'ArrayOpen' | 'ArrayClose' | 'Array' | 'ObjectOpen' | 'ObjectClose' | 'Object' | 'Root';
type ParseTokensMap = Record<ParseTokensType, Function>;
type ParseMatchersMap = Record<ParseTokensType, Matcher>;

/* LOOKUP */

type LookupChildToken = {
  type: string,
  source: string,
  token: ChildToken,
  parent: LookupParentToken | null,
  depth: number,
  index: number,
  start: number,
  end: number
};

type LookupParentToken = {
  type: string,
  children: LookupToken[],
  token: ParentToken,
  parent: LookupParentToken | null,
  depth: number,
  index: number
};

type LookupToken = LookupChildToken | LookupParentToken;

type LookupPath = (string | number)[];

type LookupResult = {
  path: LookupPath,
  property: string | number | undefined,
  value: JSONValue | undefined,
  isInsideProperty: boolean,
  isInsideValue: boolean
};

/* EXPORT */

export {JSONValue};
export {ChildToken, ParentToken, NewlineToken, WhitespaceToken, CommentLineToken, CommentBlockToken, CommaToken, CommaTrailingToken, ColonToken, NullToken, TrueToken, FalseToken, NumberToken, StringToken, ArrayOpenToken, ArrayCloseToken, ArrayToken, ObjectOpenToken, ObjectCloseToken, ObjectToken, RootToken};
export {AbstractToken, IgnoredToken, LiteralToken, TriviaToken, OpenToken, CloseToken, DelimiterToken, SeparationToken, SpecialToken, Token, AST};
export {ParseTokensMap, ParseMatchersMap};
export {LookupChildToken, LookupParentToken, LookupToken, LookupPath, LookupResult};
