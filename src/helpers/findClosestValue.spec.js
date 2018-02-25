import findClosestValue from './findClosestValue';

describe('findClosestValue', () => {
  it('should return id of closest value', () => {
    expect(findClosestValue([1, 2], 1.1)).toBe(0);
    expect(findClosestValue([1, 2], 1.9)).toBe(1);
    expect(findClosestValue([1, 2], 1.5)).toBe(0);

    expect(findClosestValue([1, 2, 3], 2)).toBe(1);
  });
});