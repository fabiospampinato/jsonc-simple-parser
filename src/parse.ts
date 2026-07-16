/* IMPORT */

import strip from "./strip";

/* HELPERS */

const _parse = JSON.parse;

/** True if strip could remove comments or trailing commas (string-aware; no false negatives). */
const maybeHasJsoncSyntax = (text: string): boolean => {
  const length = text.length;
  let i = 0;

  while (i < length) {
    const char = text.charCodeAt(i);

    if (char === 34) {
      // "
      i++;
      while (i < length) {
        const inner = text.charCodeAt(i);
        if (inner === 92) {
          // \
          i += 2;
          continue;
        }
        if (inner === 34) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (char === 47 && i + 1 < length) {
      // /
      const next = text.charCodeAt(i + 1);
      if (next === 47 || next === 42) return true; // // or /*
    }

    if (char === 44) {
      // ,
      let j = i + 1;
      while (j < length) {
        const after = text.charCodeAt(j);
        if (after === 32 || after === 9 || after === 10 || after === 13) {
          j++;
          continue;
        }
        if (after === 47 && j + 1 < length) {
          const next = text.charCodeAt(j + 1);
          if (next === 47) {
            // line comment — trailing comma before ]/} may follow
            return true;
          }
          if (next === 42) {
            // block comment
            j += 2;
            while (
              j + 1 < length &&
              !(text.charCodeAt(j) === 42 && text.charCodeAt(j + 1) === 47)
            ) {
              j++;
            }
            j += 2;
            continue;
          }
        }
        if (after === 93 || after === 125) return true; // ] or }
        break;
      }
    }

    i++;
  }

  return false;
};

/* MAIN */

const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
  // Avoid copying when already a string; `${...}` matches ToString (TypeError on Symbol)
  if (typeof text !== "string") {
    text = `${text}`;
  }

  if (reviver) {
    // A "reviver" could have side effects, it may not be safe to call it twice

    return _parse(strip(text), reviver);
  } else {
    try {
      // Shortcut in case there are no comments or trailing commas

      return _parse(text);
    } catch (error) {
      // Stripping out any potential comments and trailing commas and trying again

      if (!maybeHasJsoncSyntax(text)) {
        throw error;
      }

      const textStripped = strip(text);

      if (text === textStripped) {
        // Parsing it again would inevitably lead to the same error

        throw error;
      } else {
        return _parse(textStripped);
      }
    }
  }
};

/* EXPORT */

export default parse;
