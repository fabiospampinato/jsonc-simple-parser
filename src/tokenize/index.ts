
/* IMPORT */

import {AST} from '../types';
import Context from './context';
import parser from './parser';

/* TOKENIZE */

const tokenize = ( text: string ): AST => {

  Context.offset = 0;

  return parser ( text );

};

/* EXPORT */

export default tokenize;
