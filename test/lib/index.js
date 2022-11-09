
/* IMPORT */

import _ from 'lodash';
import {describe} from 'fava';
import JSONC from '../../dist/index.js';
import Fixtures from './fixtures.js';

/* MAIN */

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

    it ( 'returns an object describing a location in a JSONC string', t => {

      const lookup = ( target, index, usePartialScanning ) => _.omit ( JSONC.lookup ( target, index, usePartialScanning ), ['token'] ); //TODO: Actually match against the token object too

      const {object} = Fixtures.lookup;

      t.deepEqual ( lookup ( object, 5, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 10, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 70, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 71, false ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 72, false ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 75, false ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 76, false ), { path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 77, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 78, false ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 79, false ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 80, false ), { path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 81, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 89, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 90, false ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 91, false ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 94, false ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 95, false ), { path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 96, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 97, false ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 98, false ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 99, false ), { path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 100, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 123, false ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 130, false ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 131, false ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 134, false ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 135, false ), { path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 137, false ), { path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 141, false ), { path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 142, false ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 202, false ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 203, false ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 207, false ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 208, false ), { path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( object, 209, false ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 210, false ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 211, false ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 224, false ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 225, false ), { path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 226, false ), { path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( object, 275, false ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 276, false ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( lookup ( object, 277, false ), { path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 280, false ), { path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( lookup ( object, 281, false ), { path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( lookup ( object, 289, false ), { path: ['three', 'six', 2], property: 2, value: [], isInsideProperty: true, isInsideValue: true } );

      const {array} = Fixtures.lookup;

      t.deepEqual ( lookup ( array, 5, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( array, 10, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( array, 61, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );
      t.deepEqual ( lookup ( array, 67, false ), { path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false } );

      t.deepEqual ( lookup ( array, 71, false ), { path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true } );
      t.deepEqual ( lookup ( array, 72, false ), { path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true } );

      t.deepEqual ( lookup ( array, 73, false ), { path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false } );
      t.deepEqual ( lookup ( array, 78, false ), { path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false } );

      t.deepEqual ( lookup ( array, 80, false ), { path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true } );
      t.deepEqual ( lookup ( array, 83, false ), { path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( lookup ( array, 98, false ), { path: [0, 'bar'], property: 'bar', value: undefined, isInsideProperty: true, isInsideValue: false } );

      t.deepEqual ( lookup ( array, 100, false ), { path: [0, 'bar'], property: undefined, value: [123], isInsideProperty: false, isInsideValue: true } );

      t.deepEqual ( lookup ( array, 101, false ), { path: [0, 'bar', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true } );

    });

    it ( 'supports partial objects where only the property is available', t => {

      const lookup = ( target, index, usePartialScanning ) => _.omit ( JSONC.lookup ( target, index, usePartialScanning ), ['token'] ); //TODO: Actually match against the token object too

      const {objectPartial} = Fixtures.lookup;

      t.deepEqual ( lookup ( objectPartial, 3, true ), { path: ['foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false } );

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

  describe ( 'validate', it => {

    it ( 'returns true for valid strings', t => {

      const {input} = Fixtures.ast;

      t.true ( JSONC.validate ( input ) );

    });

    it ( 'returns false on invalid input', t => {

      const {prefix, suffix} = Fixtures.errors;

      t.false ( JSONC.validate ( prefix ) );
      t.false ( JSONC.validate ( suffix ) );

    });

    it ( 'returns false on insufficient input', t => {

      const {comment, empty} = Fixtures.errors;

      t.false ( JSONC.validate ( comment ) );
      t.false ( JSONC.validate ( empty ) );

    });

  });

});
