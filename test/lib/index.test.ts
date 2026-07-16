import { describe, expect, it } from 'vitest';
import JSONC from '../../src/index';
import type {Token} from '../../src/types';
import Fixtures from './fixtures.js';

const omit = <T extends Record<string, unknown>>(object: T, keys: string[]): Omit<T, string> => {
  const result = { ...object };

  for (const key of keys) {
    delete result[key];
  }

  return result;
};

describe('JSONC', () => {

  describe('ast.parse', () => {

    it('converts a string into an AST', () => {
      const { input, output } = Fixtures.ast;
      expect(JSONC.ast.parse(input)).toEqual(output);
    });

    it('throws on invalid input', () => {
      const { prefix, suffix } = Fixtures.errors;

      expect(() => JSONC.ast.parse(prefix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 0'));
      expect(() => JSONC.ast.parse(suffix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 4'));
    });

    it('throws on insufficient input', () => {
      const { comment, empty } = Fixtures.errors;

      expect(() => JSONC.ast.parse(comment)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
      expect(() => JSONC.ast.parse(empty)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
    });

  });

  describe('ast.stringify', () => {

    it('converts an AST into a string', () => {
      const { input, output } = Fixtures.ast;
      expect(JSONC.ast.stringify(output as Token)).toBe(input);
    });

  });

  describe('lookup', () => {

    it('returns an object describing a location in a JSONC string', () => {
      const lookup = (target: string, index: number, usePartialScanning: boolean) => omit(JSONC.lookup(target, index, usePartialScanning), ['token']);
      const { object } = Fixtures.lookup;

      expect(lookup(object, 5, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(object, 10, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 70, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(object, 71, false)).toEqual({ path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 72, false)).toEqual({ path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 75, false)).toEqual({ path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 76, false)).toEqual({ path: ['one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 77, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(object, 78, false)).toEqual({ path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 79, false)).toEqual({ path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 80, false)).toEqual({ path: ['one'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 81, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 89, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(object, 90, false)).toEqual({ path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 91, false)).toEqual({ path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 94, false)).toEqual({ path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 95, false)).toEqual({ path: ['two'], property: 'two', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 96, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(object, 97, false)).toEqual({ path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 98, false)).toEqual({ path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 99, false)).toEqual({ path: ['two'], property: undefined, value: {}, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 100, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 123, false)).toEqual({ path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 130, false)).toEqual({ path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 131, false)).toEqual({ path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 134, false)).toEqual({ path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 135, false)).toEqual({ path: ['three', 'one'], property: 'one', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 137, false)).toEqual({ path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 141, false)).toEqual({ path: ['three', 'one'], property: undefined, value: null, isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 142, false)).toEqual({ path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 202, false)).toEqual({ path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 203, false)).toEqual({ path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 207, false)).toEqual({ path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 208, false)).toEqual({ path: ['three', 'four'], property: 'four', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(object, 209, false)).toEqual({ path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 210, false)).toEqual({ path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 211, false)).toEqual({ path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 224, false)).toEqual({ path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 225, false)).toEqual({ path: ['three', 'four'], property: undefined, value: 'asd\n\u0022\"', isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 226, false)).toEqual({ path: ['three'], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(object, 275, false)).toEqual({ path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true });
      expect(lookup(object, 276, false)).toEqual({ path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true });

      expect(lookup(object, 277, false)).toEqual({ path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true });
      expect(lookup(object, 280, false)).toEqual({ path: ['three', 'six', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true });
      expect(lookup(object, 281, false)).toEqual({ path: ['three', 'six'], property: undefined, value: [123, true, []], isInsideProperty: false, isInsideValue: true });

      expect(lookup(object, 289, false)).toEqual({ path: ['three', 'six', 2], property: 2, value: [], isInsideProperty: true, isInsideValue: true });

      const { array } = Fixtures.lookup;

      expect(lookup(array, 5, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(array, 10, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(array, 61, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });
      expect(lookup(array, 67, false)).toEqual({ path: [], property: undefined, value: undefined, isInsideProperty: false, isInsideValue: false });

      expect(lookup(array, 71, false)).toEqual({ path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true });
      expect(lookup(array, 72, false)).toEqual({ path: [0], property: undefined, value: { foo: 123, bar: [123] }, isInsideProperty: true, isInsideValue: true });

      expect(lookup(array, 73, false)).toEqual({ path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false });
      expect(lookup(array, 78, false)).toEqual({ path: [0, 'foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false });

      expect(lookup(array, 80, false)).toEqual({ path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true });
      expect(lookup(array, 83, false)).toEqual({ path: [0, 'foo'], property: undefined, value: 123, isInsideProperty: false, isInsideValue: true });

      expect(lookup(array, 98, false)).toEqual({ path: [0, 'bar'], property: 'bar', value: undefined, isInsideProperty: true, isInsideValue: false });

      expect(lookup(array, 100, false)).toEqual({ path: [0, 'bar'], property: undefined, value: [123], isInsideProperty: false, isInsideValue: true });

      expect(lookup(array, 101, false)).toEqual({ path: [0, 'bar', 0], property: 0, value: 123, isInsideProperty: true, isInsideValue: true });
    });

    it('supports partial objects where only the property is available', () => {
      const lookup = (target: string, index: number, usePartialScanning: boolean) => omit(JSONC.lookup(target, index, usePartialScanning), ['token']);
      const { objectPartial } = Fixtures.lookup;

      expect(lookup(objectPartial, 3, true)).toEqual({ path: ['foo'], property: 'foo', value: undefined, isInsideProperty: true, isInsideValue: false });
    });

    it('throws on invalid input', () => {
      const { prefix, suffix } = Fixtures.errors;

      expect(() => JSONC.lookup(prefix, 0, false)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 0'));
      expect(() => JSONC.lookup(suffix, 0, false)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 4'));
    });

    it('throws on insufficient input', () => {
      const { comment, empty } = Fixtures.errors;

      expect(() => JSONC.lookup(comment, 0, false)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
      expect(() => JSONC.lookup(empty, 0, false)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
    });

  });

  describe('parse', () => {

    it('supports strings with comments and trailing commas', () => {
      const { input, output } = Fixtures.parse;
      expect(JSONC.parse(input)).toEqual(output);
    });

    it('throws on invalid input', () => {
      const { prefix, suffix } = Fixtures.errors;

      expect(() => JSONC.parse(prefix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 0'));
      expect(() => JSONC.parse(suffix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 4'));
    });

    it('throws on insufficient input', () => {
      const { comment, empty } = Fixtures.errors;

      expect(() => JSONC.parse(comment)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
      expect(() => JSONC.parse(empty)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
    });

  });

  describe('stringify', () => {

    it('supports serializing a value to a string', () => {
      const { output } = Fixtures.parse;

      expect(JSONC.stringify(output)).toBe(JSON.stringify(output));
      expect(JSONC.stringify).toBe(JSON.stringify);
    });

  });

  describe('strip', () => {

    it('supports stripping out comments and trailing commas', () => {
      const { input, output } = Fixtures.strip;
      expect(JSONC.strip(input)).toBe(output);
    });

    it('throws on invalid input', () => {
      const { prefix, suffix } = Fixtures.errors;

      expect(() => JSONC.strip(prefix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 0'));
      expect(() => JSONC.strip(suffix)).toThrow(new SyntaxError('Unexpected token i in JSONC at position 4'));
    });

    it('throws on insufficient input', () => {
      const { comment, empty } = Fixtures.errors;

      expect(() => JSONC.strip(comment)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
      expect(() => JSONC.strip(empty)).toThrow(new SyntaxError('Unexpected end of JSONC input'));
    });

  });

  describe('validate', () => {

    it('returns true for valid strings', () => {
      const { input } = Fixtures.ast;
      expect(JSONC.validate(input)).toBe(true);
    });

    it('returns false on invalid input', () => {
      const { prefix, suffix } = Fixtures.errors;

      expect(JSONC.validate(prefix)).toBe(false);
      expect(JSONC.validate(suffix)).toBe(false);
    });

    it('returns false on insufficient input', () => {
      const { comment, empty } = Fixtures.errors;

      expect(JSONC.validate(comment)).toBe(false);
      expect(JSONC.validate(empty)).toBe(false);
    });

  });

});
