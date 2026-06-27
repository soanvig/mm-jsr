import { Value } from '../models/Value';
import { expect, test } from 'vitest';

test('asRatio inside minmax', () => {
  expect(getRatio(0, 100, 50)).toBe(0.5);
  expect(getRatio(50, 150, 100)).toBe(0.5);
  expect(getRatio(-100, -50, -75)).toBe(0.5);
});

test('asRatio handles zeros', () => {
  expect(getRatio(-50, 0, -25)).toBe(0.5);
  expect(getRatio(-100, 100, 0)).toBe(0.5);
});

test('asRatio equals minmax', () => {
  expect(getRatio(0, 100, 0)).toBe(0);
  expect(getRatio(0, 100, 100)).toBe(1);
});

test('asRatio beyond minmax', () => {
  expect(getRatio(0, 100, 150)).toBe(1.5);
  expect(getRatio(0, 100, -50)).toBe(-0.5);
});

test('asRatio edge cases', () => {
  expect(getRatio(100, 100, 50)).toBe(1);
  expect(getRatio(-50, -50, 25)).toBe(1);
  expect(getRatio(0, 0, 0)).toBe(1);
});

test('asReal', () => {
  expect(getReal(1)).toBe(1);
  expect(getReal(50)).toBe(50);
  expect(getReal(-20)).toBe(-20);
});

test('fromRation', () => {
  expect(Value.fromRatio({ min: 100, max: 150, ratio: 0.5 }).asReal()).toBe(125);
});

const getRatio = (min: number, max: number, value: number) =>
  Value.fromReal({ real: value, min, max }).asRatio();
const getReal = (value: number) => Value.fromReal({ real: value, min: 0, max: 100 }).asReal();
