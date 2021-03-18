
/* IMPORT */

import {AST} from '../types';
import Context from './context';
import parser from './parser';

/* TOKENIZE */

const tokenize = ( text: string, limit: number = Infinity ): AST => {

  Context.offset = 0;
  Context.offsetMax = limit;

  return parser ( text );

};

/* EXPORT */

export default tokenize;
