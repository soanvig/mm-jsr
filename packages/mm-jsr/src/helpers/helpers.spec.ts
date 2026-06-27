import { avg } from '../helpers/avg';
import { closest } from '../helpers/closest';
import { neighbourGroup } from '../helpers/neighbourGroup';
import { range } from '../helpers/range';
import { times } from '../helpers/times';
import { uniq } from '../helpers/uniq';
import { expect, test } from 'vitest';

test('neighbourGroup', () => {
  expect(neighbourGroup([])).toEqual([]);
  expect(neighbourGroup([1])).toEqual([]);
  expect(neighbourGroup([1, 2])).toEqual([[1, 2]]);
  expect(neighbourGroup([1, 2, 3])).toEqual([
    [1, 2],
    [2, 3],
  ]);
  expect(neighbourGroup([1, 2, 3, 4])).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
  ]);
});

test('range', () => {
  expect(range(0)).toEqual([]);

  expect(range(1, 1)).toEqual([1]);
  expect(range(1, 2)).toEqual([1, 2]);
  expect(range(1, 3)).toEqual([1, 2, 3]);

  expect(range(3)).toEqual([0, 1, 2, 3]);

  expect(range(2, 1)).toEqual([1, 2]);

  expect(range(-2)).toEqual([-2, -1, 0]);
});

test('times', () => {
  expect(times(1, (n) => n)).toEqual([1]);
  expect(times(2, (n) => n)).toEqual([1, 2]);
  expect(times(3, (n) => n)).toEqual([1, 2, 3]);

  expect(times(0, (n) => n)).toEqual([]);
});

test('helpers', () => {
  expect(uniq([])).toEqual([]);
  expect(uniq([1])).toEqual([1]);
  expect(uniq([1, 2])).toEqual([1, 2]);
  expect(uniq([1, 1, 2])).toEqual([1, 2]);
  expect(uniq([1, 2, 1])).toEqual([1, 2]);
});

test('avg', () => {
  expect(avg(1, 2, 3)).toEqual(2);
  expect(avg(5)).toEqual(5);
  expect(avg(10, 20)).toEqual(15);
});

test('closest', () => {
  const arr = [0, 20, 50, 100];

  expect(closest(25, arr)).toEqual(1);
  expect(closest(50, arr)).toEqual(2);
  expect(closest(35, arr)).toEqual(2);
});
