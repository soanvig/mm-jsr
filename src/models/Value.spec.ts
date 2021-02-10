import { Value } from '@/models/Value';
import test from 'ava';

test('asRatio inside minmax', t => {
  t.is(getRatio(0, 100, 50), 0.5);
  t.is(getRatio(50, 150, 100), 0.5);
  t.is(getRatio(-100, -50, -75), 0.5);
});

test('asRatio handles zeros', t => {
  t.is(getRatio(-50, 0, -25), 0.5);
  t.is(getRatio(-100, 100, 0), 0.5);
});

test('asRatio equals minmax', t => {
  t.is(getRatio(0, 100, 0), 0);
  t.is(getRatio(0, 100, 100), 1);
});

test('asRatio beyond minmax', t => {
  t.is(getRatio(0, 100, 150), 1.5);
  t.is(getRatio(0, 100, -50), -0.5);
});

test('asRatio edge cases', t => {
  t.is(getRatio(100, 100, 50), 1);
  t.is(getRatio(-50, -50, 25), 1);
  t.is(getRatio(0, 0, 0), 1);
});

test('asReal', t => {
  t.is(getReal(1), 1);
  t.is(getReal(50), 50);
  t.is(getReal(-20), -20);
});

test('formatted', t => {
  t.is(getFormatted(50, v => v.toString().slice(0, 1)), '5');
});

const getRatio = (min: number, max: number, value: number) => Value.fromData({ real: value, min, max, formatter: () => '' }).asRatio();
const getFormatted = (value: number, formatter: (v: number) => string) => Value.fromData({ real: value, min: 0, max: 100, formatter }).asFormatted();
const getReal = (value: number) => Value.fromData({ real: value, min: 0, max: 100, formatter: () => '' }).asReal();