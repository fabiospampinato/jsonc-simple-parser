/* IMPORT */

import type {
  JSONValue,
  ChildToken,
  ParentToken,
  AST,
  LookupChildToken,
  LookupParentToken,
  LookupPath,
  LookupResultToken,
  LookupResult,
} from "./types";
import detokenize from "./detokenize";
import parse from "./parse";
import tokenize from "./tokenize";
import Utils from "./utils";

/* MAIN */

//FIXME: This is wonky, it should be much more robust, it should probably be rewritten from scratch

const getLookupToken = (ast: AST, position: number): LookupChildToken | null => {
  let tokenPosition: LookupChildToken | null = null;
  let offsetCurrent = 0;

  const checkPositionToken = (token: LookupChildToken): void => {
    if (token.start > position) return;
    if (token.end <= position - 1) return;
    if (tokenPosition && Utils.isTokenLiteral(tokenPosition)) return;
    if (tokenPosition && Utils.isTokenIgnored(token)) return;
    tokenPosition = token;
  };

  const coversPosition = (start: number, end: number): boolean => {
    return start <= position && end > position - 1;
  };

  const parseChild = (
    token: ChildToken,
    parent: LookupParentToken | null,
    depth: number,
    index: number,
  ): LookupChildToken | null => {
    const { type, source } = token;
    const start = offsetCurrent;
    const end = (offsetCurrent += source.length);

    if (!Utils.isTokenLiteral(token) && !coversPosition(start, end)) {
      return null;
    }

    const ltoken: LookupChildToken = { type, source, token, parent, depth, index, start, end };
    checkPositionToken(ltoken);
    return ltoken;
  };

  const parseParent = (
    token: ParentToken,
    parent: LookupParentToken | null,
    depth: number,
    index: number,
  ): LookupParentToken => {
    const { type } = token;
    const start = offsetCurrent;
    const ltoken: LookupParentToken = {
      type,
      children: [],
      token,
      parent,
      depth,
      index,
      start,
      end: start,
    };
    let literalIndex = 0;

    for (let i = 0, l = token.children.length; i < l; i++) {
      const childToken = token.children[i];

      if ("children" in childToken) {
        const child = parseParent(childToken, ltoken, depth + 1, literalIndex);
        child.index = literalIndex++;
        ltoken.children.push(child);
        continue;
      }

      if (Utils.isTokenLiteral(childToken)) {
        const child = parseChild(childToken, ltoken, depth + 1, literalIndex);
        if (child) {
          child.index = literalIndex++;
          ltoken.children.push(child);
        }
        continue;
      }

      // Ignored/delimiter: advance offset; allocate only if it covers `position`
      parseChild(childToken, ltoken, depth + 1, i);
    }

    ltoken.end = offsetCurrent;
    return ltoken;
  };

  const parseToken = (
    token: ChildToken | ParentToken,
    parent: LookupParentToken | null,
    depth: number,
    index: number,
  ): LookupChildToken | LookupParentToken | null => {
    if ("children" in token) return parseParent(token, parent, depth, index);
    return parseChild(token, parent, depth, index);
  };

  parseToken(ast, null, -1, -1);

  return tokenPosition;
};

const getLookupPath = (token: LookupChildToken | null): LookupPath => {
  if (!token) return [];

  const path: LookupPath = [];
  let walker: LookupChildToken | LookupParentToken | null = token;

  while (walker) {
    const parent: LookupParentToken | null = walker.parent;

    if (!parent) break;

    if (Utils.isTokenLiteral(walker)) {
      if (parent.type === "Object") {
        if (Utils.isEven(walker.index)) {
          path.unshift(JSON.parse((walker as LookupChildToken).source));
        } else {
          path.unshift(JSON.parse((parent.children[walker.index - 1] as LookupChildToken).source));
        }
      } else if (parent.type === "Array") {
        path.unshift(walker.index);
      }
    }

    walker = parent;
  }

  return path;
};

const getLookupIsInsideProperty = (token: LookupChildToken | null): boolean => {
  if (!token) return false;

  const parentType = token.parent?.type;

  if (parentType === "Object")
    return Utils.isTokenLiteral(token)
      ? Utils.isEven(token.index)
      : token.parent?.parent?.type === "Array";

  if (parentType === "Array")
    return Utils.isTokenLiteral(token) || token.parent?.parent?.type === "Array";

  return false;
};

const getLookupIsInsideValue = (token: LookupChildToken | null): boolean => {
  if (!token) return false;

  const isParentEmpty = !token.parent?.children.length;
  const parentType = token.parent?.type;

  if (parentType === "Object")
    return (
      isParentEmpty ||
      Utils.isTokenDelimiter(token) ||
      (Utils.isTokenLiteral(token) && Utils.isOdd(token.index))
    );

  if (parentType === "Array") return token.depth > 1;

  return false;
};

const getLookupProperty = (
  token: LookupChildToken | null,
  isInsideProperty: boolean,
): string | number | undefined => {
  if (!isInsideProperty || !token) return;

  const parentType = token.parent?.type;

  if (Utils.isTokenLiteral(token)) {
    if (parentType === "Array") return token.index;

    return parse(detokenize(token));
  }

  if (parentType === "Array") return token.parent?.index;

  return undefined;
};

const getLookupValue = (
  token: LookupChildToken | null,
  isInsideValue: boolean,
  usePartialScanning: boolean,
  text: string,
): JSONValue | undefined => {
  if (!isInsideValue || !token) return;

  if (Utils.isTokenLiteral(token)) return parse(detokenize(token));

  if (usePartialScanning) return;

  const { parent } = token;

  if (!parent || !parent.token) return;

  if (parent.type !== "Array" && parent.type !== "Object") return;

  return parse(text.slice(parent.start, parent.end));
};

const lookup = (
  text: string,
  position: number,
  usePartialScanning: boolean = true,
): LookupResult => {
  const limit = usePartialScanning ? position : Infinity;
  const ast = tokenize(text, limit);
  const token = getLookupToken(ast, position);
  const path = getLookupPath(token);
  const isInsideProperty = getLookupIsInsideProperty(token);
  const isInsideValue = getLookupIsInsideValue(token);
  const property = getLookupProperty(token, isInsideProperty);
  const value = getLookupValue(token, isInsideValue, usePartialScanning, text);
  const t = token
    ? ({
        type: token.type,
        start: token.start,
        end: token.end,
        source: token.source,
      } as LookupResultToken)
    : undefined;
  const result: LookupResult = { path, property, value, token: t, isInsideProperty, isInsideValue };

  return result;
};

/* EXPORT */

export default lookup;
