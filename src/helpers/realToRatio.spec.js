import realToRatio from './realToRatio';

describe('realToRatio', () => {
  it('should convert real number to number from min-max ratio', () => {
    expect(realToRatio(0, 100, 10)).toBeCloseTo(0.1, 2);
    expect(realToRatio(0, 100, 99)).toBeCloseTo(0.99, 3);
    expect(realToRatio(0, 100, 0)).toBe(0);
    expect(realToRatio(0, 100, 100)).toBe(1);
  });
});