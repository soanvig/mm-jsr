import { listenOn, throttle, calculateDecimals } from '../src/assets/js/helpers.js';

describe('test calculateDecimals', () => {
  test('input as integer', () => {
    const input = 2;
    const result = calculateDecimals(input);
    expect(result).toBe(0);
  });

  test('input as float', () => {
    const input = 2.12;
    const result = calculateDecimals(input);
    expect(result).toBe(2);
  });
});