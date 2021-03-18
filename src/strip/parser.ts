
/* IMPORT */

import {parse} from 'reghex';
import grammar from '../tokenize/grammar';
import tokens from './tokens';

/* PARSER */

const parser = parse ( grammar ( tokens ) );

/* EXPORT */

export default parser;
