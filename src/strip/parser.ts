
/* IMPORT */

import {parse} from 'reghex';
import grammar from '../tokenize/grammar';
import tokens from './tokens';

/* MAIN */

const parser = parse ( grammar ( tokens ) );

/* EXPORT */

export default parser;
