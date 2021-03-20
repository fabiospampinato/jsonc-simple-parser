
/* IMPORT */

import parse from './parse';

/* VALIDATE */

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
