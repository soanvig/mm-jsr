import calculateDecimals from './calculateDecimals';

describe('calculateDecimals', () => {
  it('should be a function', () => {
    expect(calculateDecimals).toBeInstanceOf(Function);
  });

  describe('when provided with a number', () => {
    it('should return number of decimals places for various cases', () => {
      expect(calculateDecimals(1)).toBe(0);
      expect(calculateDecimals(1.0)).toBe(0);
      expect(calculateDecimals(1.00)).toBe(0);
      expect(calculateDecimals(1.001)).toBe(3);
      expect(calculateDecimals(0.0001)).toBe(4);
    });
  });

  describe('when provided with a string', () => {
    it('should return number of decimals places', () => {
      expect(calculateDecimals('0.001')).toBe(3);
    });
  });
});