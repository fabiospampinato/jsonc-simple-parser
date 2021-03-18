
/* IMPORT */

import {JSONValue} from './types';
import {ChildToken, ParentToken, AST} from './types';
import {LookupChildToken, LookupParentToken, LookupPath, LookupResult} from './types';
import detokenize from './detokenize';
import parse from './parse';
import tokenize from './tokenize';
import Utils from './utils';

/* LOOKUP */

//FIXME: This is wonky, it should be much more robust, it should probably be rewritten from scratch

const getLookupToken = ( ast: AST, position: number ): LookupChildToken | null => {

  let tokenPosition: LookupChildToken | null = null,
      offsetCurrent = 0;

  const checkPositionToken = ( token: LookupChildToken ): void => {
    if ( token.start > position ) return;
    if ( token.end <= ( position - 1 ) ) return;
    if ( tokenPosition && Utils.isTokenLiteral ( tokenPosition ) ) return;
    if ( tokenPosition && Utils.isTokenIgnored ( token ) ) return;
    tokenPosition = token;
  };

  const parseChild = ( token: ChildToken, parent: LookupParentToken | null, depth: number, index: number ): LookupChildToken => {
    const {type, source} = token;
    const start = offsetCurrent;
    const end = ( offsetCurrent += source.length );
    const ltoken: LookupChildToken = {type, source, token, parent, depth, index, start, end};
    checkPositionToken ( ltoken );
    return ltoken;
  };

  const parseParent = ( token: ParentToken, parent: LookupParentToken | null, depth: number, index: number ): LookupParentToken => {
    const {type} = token;
    const ltoken: LookupParentToken = {type, children: [], token, parent, depth, index};
    ltoken.children = token.children.map ( ( child, index ) => parseToken ( child, ltoken, depth + 1, index ) ).filter ( Utils.isTokenLiteral );
    ltoken.children.forEach ( ( token, index ) => token.index = index );
    return ltoken;
  };

  const parseToken = ( token: ChildToken | ParentToken, parent: LookupParentToken | null, depth: number, index: number ): LookupChildToken | LookupParentToken => {
    if ( 'children' in token ) return parseParent ( token, parent, depth, index );
    return parseChild ( token, parent, depth, index );
  };

  parseToken ( ast, null, -1, -1 );

  return tokenPosition;

};

const getLookupPath = ( token: LookupChildToken | null ): LookupPath => {

  if ( !token ) return [];

  const path: LookupPath = [];

  while ( token ) {

    const parent = token.parent;

    if ( !parent ) break;

    if ( Utils.isTokenLiteral ( token ) ) {

      if ( parent.type === 'Object' ) {

        if ( Utils.isEven ( token.index ) ) {

          path.unshift ( JSON.parse ( token.source ) );

        } else {

          path.unshift ( JSON.parse ( parent.children[token.index - 1].source ) );

        }

      } else if ( parent.type === 'Array' ) {

        path.unshift ( token.index );

      }

    }

    token = parent;

  }

  return path;

};

const getLookupIsInsideProperty = ( token: LookupChildToken | null ): boolean => {

  if ( !token ) return false;

  const parentType = token.parent?.type;

  if ( parentType === 'Object' ) return Utils.isTokenLiteral ( token ) ? Utils.isEven ( token.index ) : token.parent?.parent?.type === 'Array';

  if ( parentType === 'Array' ) return Utils.isTokenLiteral ( token ) || token.parent?.parent?.type === 'Array';

  return false;

};

const getLookupIsInsideValue = ( token: LookupChildToken | null ): boolean => {

  if ( !token ) return false;

  const isParentEmpty = !token.parent?.children.length,
        parentType = token.parent?.type;

  if ( parentType === 'Object' ) return isParentEmpty || Utils.isTokenDelimiter ( token ) || ( Utils.isTokenLiteral ( token ) && Utils.isOdd ( token.index ) );

  if ( parentType === 'Array' ) return ( token.depth > 1 );

  return false;

};

const getLookupProperty = ( token: LookupChildToken | null, isInsideProperty: boolean ): string | number | undefined => {

  if ( !isInsideProperty || !token ) return;

  const parentType = token.parent?.type;

  if ( Utils.isTokenLiteral ( token ) ) {

    if ( parentType === 'Array' ) return token.index;

    return parse ( detokenize ( token ) );

  } else {

    if ( parentType === 'Array' ) return token.parent?.index;

  }

};

const getLookupValue = ( token: LookupChildToken | null, isInsideValue: boolean ): JSONValue | undefined => {

  if ( !isInsideValue || !token ) return;

  if ( Utils.isTokenLiteral ( token ) ) return parse ( detokenize ( token ) );

  const {parent} = token;

  if ( !parent || !parent.token ) return;

  if ( parent.type !== 'Array' && parent.type !== 'Object' ) return;

  return parse ( detokenize ( parent.token ) );

};

const lookup = ( text: string, position: number ): LookupResult => {

  const ast = tokenize ( text ),
        token = getLookupToken ( ast, position ),
        path = getLookupPath ( token ),
        isInsideProperty = getLookupIsInsideProperty ( token ),
        isInsideValue = getLookupIsInsideValue ( token ),
        property = getLookupProperty ( token, isInsideProperty ),
        value = getLookupValue ( token, isInsideValue ),
        result: LookupResult = {path, property, value, isInsideProperty, isInsideValue};

  return result;

};

/* EXPORT */

export default lookup;
