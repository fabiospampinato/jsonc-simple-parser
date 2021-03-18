
/* IMPORT */

import parser from './parser';

/* STRIP */

const strip = ( text: string ): string => {

  return parser ( text );

};

/* EXPORT */

export default strip;
