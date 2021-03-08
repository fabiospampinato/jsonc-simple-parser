
/* IMPORT */

import {parse} from 'reghex';
import grammar from './grammar';

/* STRIP */

const strip = parse ( grammar () );

/* EXPORT */

export default strip;
