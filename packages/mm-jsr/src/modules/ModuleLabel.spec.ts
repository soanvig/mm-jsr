import { getAllNeighourLabels, getPrimaryLabels, verifyVisibleLabels } from '@/modules/ModuleLabel';
import test from 'ava';

test('getPrimaryLabels', t => {
  t.deepEqual(getPrimaryLabels(0), []);
  t.deepEqual(getPrimaryLabels(1), ['0']);
  t.deepEqual(getPrimaryLabels(2), ['0', '1']);
  t.deepEqual(getPrimaryLabels(3), ['0', '1', '2']);
});

test('getAllNeighourLabels', t => {
  t.deepEqual(getAllNeighourLabels(0), [[]]);
  t.deepEqual(getAllNeighourLabels(1), [[]]);
  t.deepEqual(getAllNeighourLabels(2), [['01']]);
  t.deepEqual(getAllNeighourLabels(3), [['01', '12'], ['012']]);
  t.deepEqual(getAllNeighourLabels(4), [['01', '12', '23'], ['012', '123'], ['0123']]);
});

test('verifyVisibleLabels', t => {
  t.deepEqual(verifyVisibleLabels([], ['0', '1', '2'], (one, two) => false), ['0', '1', '2']);
  t.deepEqual(verifyVisibleLabels([], ['0', '1', '2'], (one, two) => one === '0' && two === '1'), ['01', '2']);
  t.deepEqual(verifyVisibleLabels([], ['0', '1', '2'], (one, two) => true), ['012']);
  t.deepEqual(verifyVisibleLabels([], ['0', '1', '2'], (one, two) => {
    return (one === '1' && two === '2')
      || (one === '0' && two === '12');
  }), ['012']);
});