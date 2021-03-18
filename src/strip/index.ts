
/* IMPORT */

import Context from './context';
import parser from './parser';

/* STRIP */

const strip = ( text: string ): string => {

  Context.offset = 0;

  return parser ( text );

};

/* EXPORT */

export default strip;
