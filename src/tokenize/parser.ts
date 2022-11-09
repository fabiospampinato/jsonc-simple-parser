
/* IMPORT */

import {parse} from 'reghex';
import grammar from './grammar';
import tokens from './tokens';

/* MAIN */

const parser = parse ( grammar ( tokens ) );

/* EXPORT */

export default parser;
