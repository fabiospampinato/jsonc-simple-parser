
/* IMPORT */

import {describe} from 'ava-spec';
import JSONC from '../../dist';
import Fixtures from './fixtures';

/* JSONC */

describe ( 'JSONC', () => {

  describe ( 'ast.parse', it => {

    it ( 'converts a string into an AST', t => {

      const {input, output} = Fixtures.ast;

      t.deepEqual ( JSONC.ast.parse ( input ), output );

    });

    it ( 'throws on invalid input', t => {

      const {prefix, suffix} = Fixtures.errors;

      t.throws ( () => JSONC.ast.parse ( prefix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 0' } );
      t.throws ( () => JSONC.ast.parse ( suffix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 4' } );

    });

    it ( 'throws on insufficient input', t => {

      const {comment, empty} = Fixtures.errors;

      t.throws ( () => JSONC.ast.parse ( comment ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );
      t.throws ( () => JSONC.ast.parse ( empty ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );

    });

  });

  describe ( 'ast.stringify', it => {

    it ( 'converts an AST into a string', t => {

      const {input, output} = Fixtures.ast;

      t.is ( JSONC.ast.stringify ( output ), input );

    });

  });

  describe ( 'lookup', it => {

    it ( 'does something', t => {

      const {object} = Fixtures.lookup;

      t.deepEqual ( JSONC.lookup ( object, 5 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 10 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 70 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 71 ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 72 ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 75 ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 76 ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 77 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 78 ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 79 ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 80 ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 81 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 89 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 90 ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 91 ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 94 ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 95 ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 96 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 97 ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 98 ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 99 ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 100 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 123 ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 130 ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 131 ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 134 ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 135 ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 137 ), { path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 141 ), { path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 142 ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 202 ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 203 ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 207 ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 208 ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( object, 209 ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 210 ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 211 ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 224 ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 225 ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 226 ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( object, 275 ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 276 ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( JSONC.lookup ( object, 277 ), { path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 280 ), { path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( object, 281 ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( JSONC.lookup ( object, 289 ), { path: ['three', 'six', 2], property: 2, value: [], isInsideProperty: true, isInsideValue: true } );

      const {array} = Fixtures.lookup;

      t.deepEqual ( JSONC.lookup ( array, 5 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( array, 10 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( array, 61 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( array, 67 ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( array, 71 ), { path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( array, 72 ), { path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true } );

      t.deepEqual ( JSONC.lookup ( array, 73 ), { path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( JSONC.lookup ( array, 78 ), { path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( array, 80 ), { path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( JSONC.lookup ( array, 83 ), { path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( JSONC.lookup ( array, 98 ), { path: [0, 'bar'], property: 'bar', value: undefined, isInsideProperty: true, isInsideValue: false } );

      t.deepEqual ( JSONC.lookup ( array, 100 ), { path: [0, 'bar'], property: undefined, value: [123], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( JSONC.lookup ( array, 101 ), { path: [0, 'bar', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );

    });

    it ( 'throws on invalid input', t => {

      const {prefix, suffix} = Fixtures.errors;

      t.throws ( () => JSONC.lookup ( prefix, 0, false ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 0' } );
      t.throws ( () => JSONC.lookup ( suffix, 0, false ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 4' } );

    });

    it ( 'throws on insufficient input', t => {

      const {comment, empty} = Fixtures.errors;

      t.throws ( () => JSONC.lookup ( comment, 0, false ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );
      t.throws ( () => JSONC.lookup ( empty, 0, false ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );

    });

  });

  describe ( 'parse', it => {

    it ( 'supports strings with comments and trailing commas', t => {

      const {input, output} = Fixtures.parse;

      t.deepEqual ( JSONC.parse ( input ), output );

    });

    it ( 'throws on invalid input', t => {

      const {prefix, suffix} = Fixtures.errors;

      t.throws ( () => JSONC.parse ( prefix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 0' } );
      t.throws ( () => JSONC.parse ( suffix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 4' } );

    });

    it ( 'throws on insufficient input', t => {

      const {comment, empty} = Fixtures.errors;

      t.throws ( () => JSONC.parse ( comment ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );
      t.throws ( () => JSONC.parse ( empty ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );

    });

  });

  describe ( 'stringify', it => {

    it ( 'supports serializing a value to a string', t => {

      const {output} = Fixtures.parse;

      t.is ( JSONC.stringify ( output ), JSON.stringify ( output ) );
      t.is ( JSONC.stringify, JSON.stringify );

    });

  });

  describe ( 'strip', it => {

    it ( 'supports stripping out comments and trailing commas', t => {

      const {input, output} = Fixtures.strip;

      t.is ( JSONC.strip ( input ), output );

    });

    it ( 'throws on invalid input', t => {

      const {prefix, suffix} = Fixtures.errors;

      t.throws ( () => JSONC.strip ( prefix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 0' } );
      t.throws ( () => JSONC.strip ( suffix ), { instanceOf: SyntaxError, message: 'Unexpected token i in JSONC at position 4' } );

    });

    it ( 'throws on insufficient input', t => {

      const {comment, empty} = Fixtures.errors;

      t.throws ( () => JSONC.strip ( comment ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );
      t.throws ( () => JSONC.strip ( empty ), { instanceOf: SyntaxError, message: 'Unexpected end of JSONC input' } );

    });

  });

});
