
/* IMPORT */

import {AST} from '../types';
import parser from './parser';

/* TOKENIZE */

const tokenize = ( text: string ): AST => {

  return parser ( text );

};

/* EXPORT */

export default tokenize;
