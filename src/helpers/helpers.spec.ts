import { avg } from '@/helpers/avg';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { times } from '@/helpers/times';
import { uniq } from '@/helpers/uniq';
import test from 'ava';

test('neighbourGroup', t => {
  t.deepEqual(neighbourGroup([]), []);
  t.deepEqual(neighbourGroup([1]), []);
  t.deepEqual(neighbourGroup([1, 2]), [[1, 2]]);
  t.deepEqual(neighbourGroup([1, 2, 3]), [[1, 2], [2, 3]]);
  t.deepEqual(neighbourGroup([1, 2, 3, 4]), [[1, 2], [2, 3], [3, 4]]);
});

test('range', t => {
  t.deepEqual(range(0), []);

  t.deepEqual(range(1, 1), [1]);
  t.deepEqual(range(1, 2), [1, 2]);
  t.deepEqual(range(1, 3), [1, 2, 3]);

  t.deepEqual(range(3), [0, 1, 2, 3]);

  t.deepEqual(range(2, 1), [1, 2]);

  t.deepEqual(range(-2), [-2, -1, 0]);
});

test('times', t => {
  t.deepEqual(times(1, n => n), [1]);
  t.deepEqual(times(2, n => n), [1, 2]);
  t.deepEqual(times(3, n => n), [1, 2, 3]);

  t.deepEqual(times(0, n => n), []);
});

test('helpers', t => {
  t.deepEqual(uniq([]), []);
  t.deepEqual(uniq([1]), [1]);
  t.deepEqual(uniq([1, 2]), [1, 2]);
  t.deepEqual(uniq([1, 1, 2]), [1, 2]);
  t.deepEqual(uniq([1, 2, 1]), [1, 2]);
});

test('avg', t => {
  t.deepEqual(avg(1, 2, 3), 2);
  t.deepEqual(avg(5), 5);
  t.deepEqual(avg(10, 20), 15);
});
