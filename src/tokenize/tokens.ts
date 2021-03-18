
/* IMPORT */

import {ParseTokensMap, ChildToken, ParentToken, NewlineToken, WhitespaceToken, CommentLineToken, CommentBlockToken, CommaToken, CommaTrailingToken, ColonToken, NullToken, TrueToken, FalseToken, NumberToken, StringToken, ArrayOpenToken, ArrayCloseToken, ArrayToken, ObjectOpenToken, ObjectCloseToken, ObjectToken, RootToken, Token} from '../types';
import Utils from '../utils';
import Context from './context';

/* HELPERS */

const makeChild = <T extends ChildToken> ( type: string ) => ( values: [string] ): T => {
  const source = values[0];
  Context.offset += source.length;
  return {type, source} as T;
};

const makeParent = <T extends ParentToken> ( type: string ) => ( values: (Token | Token[])[] ): T => {
  const children = values.flat ();
  return {type, children} as T;
};

/* TOKENS */

const Tokens: ParseTokensMap = {
  EarlyReturn: (): [] | undefined => {
    if ( Context.offset > Context.offsetMax ) return [];
  },
  Insufficient: ( values: [string] ): never => {
    if ( values[0].length ) Tokens.Invalid ( values );
    throw new SyntaxError ( 'Unexpected end of JSONC input' );
  },
  Invalid: ( values: [string] ): never => {
    throw new SyntaxError ( `Unexpected token ${values[0]} in JSONC at position ${Context.offset}` );
  },
  Passthrough: ( values: (string | string[] | Token | Token[])[] ): Token[] => {
    return values.flat ().filter ( Utils.isToken );
  },
  Newline: makeChild <NewlineToken> ( 'Newline' ),
  Whitespace: makeChild <WhitespaceToken> ( 'Whitespace' ),
  CommentLine: makeChild <CommentLineToken> ( 'CommentLine' ),
  CommentBlock: makeChild <CommentBlockToken> ( 'CommentBlock' ),
  Comma: makeChild <CommaToken> ( 'Comma' ),
  CommaTrailing: makeChild <CommaTrailingToken> ( 'CommaTrailing' ),
  Colon: makeChild <ColonToken> ( 'Colon' ),
  Null: makeChild <NullToken> ( 'Null' ),
  True: makeChild <TrueToken> ( 'True' ),
  False: makeChild <FalseToken> ( 'False' ),
  Number: makeChild <NumberToken> ( 'Number' ),
  String: makeChild <StringToken> ( 'String' ),
  ArrayOpen: makeChild <ArrayOpenToken> ( 'ArrayOpen' ),
  ArrayClose: makeChild <ArrayCloseToken> ( 'ArrayClose' ),
  Array: makeParent <ArrayToken> ( 'Array' ),
  ObjectOpen: makeChild <ObjectOpenToken> ( 'ObjectOpen' ),
  ObjectClose: makeChild <ObjectCloseToken> ( 'ObjectClose' ),
  Object: makeParent <ObjectToken> ( 'Object' ),
  Root: makeParent <RootToken> ( 'Root' )
};

/* EXPORT */

export default Tokens;
