import {
  getAllNeighourLabels,
  getPrimaryLabels,
  verifyVisibleLabels,
} from '../modules/ModuleLabel';
import { expect, test } from 'vitest';

test('getPrimaryLabels', () => {
  expect(getPrimaryLabels(0)).toEqual([]);
  expect(getPrimaryLabels(1)).toEqual(['0']);
  expect(getPrimaryLabels(2)).toEqual(['0', '1']);
  expect(getPrimaryLabels(3)).toEqual(['0', '1', '2']);
});

test('getAllNeighourLabels', () => {
  expect(getAllNeighourLabels(0)).toEqual([[]]);
  expect(getAllNeighourLabels(1)).toEqual([[]]);
  expect(getAllNeighourLabels(2)).toEqual([['01']]);
  expect(getAllNeighourLabels(3)).toEqual([['01', '12'], ['012']]);
  expect(getAllNeighourLabels(4)).toEqual([['01', '12', '23'], ['012', '123'], ['0123']]);
});

test('verifyVisibleLabels', () => {
  expect(verifyVisibleLabels([], ['0', '1', '2'], (_one, _two) => false)).toEqual(['0', '1', '2']);
  expect(
    verifyVisibleLabels([], ['0', '1', '2'], (one, two) => one === '0' && two === '1'),
  ).toEqual(['01', '2']);
  expect(verifyVisibleLabels([], ['0', '1', '2'], (_one, _two) => true)).toEqual(['012']);
  expect(
    verifyVisibleLabels([], ['0', '1', '2'], (one, two) => {
      return (one === '1' && two === '2') || (one === '0' && two === '12');
    }),
  ).toEqual(['012']);
});
