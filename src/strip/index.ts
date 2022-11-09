
/* IMPORT */

import Context from '../tokenize/context';
import parser from './parser';

/* MAIN */

const strip = ( text: string ): string => {

  Context.init ();

  return parser ( text );

};

/* EXPORT */

export default strip;
