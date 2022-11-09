
/* IMPORT */

import parse from './parse';

/* MAIN */

const validate = ( text: string ): boolean => {

  try {

    parse ( text );

    return true;

  } catch {

    return false;

  }

};

/* EXPORT */

export default validate;
