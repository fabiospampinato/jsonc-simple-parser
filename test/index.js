
/* IMPORT */

import {describe} from 'ava-spec';
import JSONC from '../dist';

/* JSONC */

describe ( 'JSONC', it => {

  it ( 'supports comments and trailing commas', t => {

    const source = `
      { // This is an example
        "foo": 123,
        /* TRAILING COMMAS */
        "bar": [1, 2, 3,],
      }
    `;

    const target = {
      foo: 123,
      bar: [1, 2, 3]
    };

    t.deepEqual ( JSONC.parse ( source ), target );
    t.is ( JSONC.stringify ( target ), JSON.stringify ( target ) );

  });

});
