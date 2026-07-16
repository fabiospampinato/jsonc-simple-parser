
/* IMPORT */

import {parse} from 'reghex';
import type {AST} from '../types';
import grammar from './grammar';
import tokens from './tokens';

/* MAIN */

const parser = parse ( grammar ( tokens ) ) as ( input: string ) => AST;

/* EXPORT */

export default parser;
