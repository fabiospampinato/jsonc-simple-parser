
/* IMPORT */

import type {AST} from '../types';
import Context from './context';
import parser from './parser';

/* MAIN */

const tokenize = ( text: string, limit?: number ): AST => {

  Context.init ( limit );

  return parser ( text );

};

/* EXPORT */

export default tokenize;
