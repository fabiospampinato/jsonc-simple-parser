
/* IMPORT */

import strip from './strip';

/* HELPERS */

const {parse, stringify} = JSON;

/* JSONC */

const JSONC = {
  stringify,
  parse: ( text: string, reviver?: ( this: any, key: string, value: any ) => any ): any => {
    text = `${text}`; // "text" can actually be anything, but we need a string here
    if ( reviver ) { // A "reviver" could have side effects, it may not be safe to call it twice
      return parse ( strip ( text ) ?? text, reviver );
    } else {
      try { // Shortcut in case there are no comments or trailing commas
        return parse ( text );
      } catch ( error ) { // Stripping out any potential comments and trailing commas and trying again
        const textStripped = strip ( text );
        if ( text === textStripped ) { // Parsing it again would inevitably lead to the same error
          throw error;
        } else {
          return parse ( textStripped ?? text );
        }
      }
    }
  }
};

/* EXPORT */

export default JSONC;
