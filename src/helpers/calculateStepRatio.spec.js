import calculateStepRatio from './calculateStepRatio';

describe('calculateStepRatio', () => {
  it('should return ratio of value in min-max range', () => {
    expect(calculateStepRatio(0, 1, 0.1)).toBeCloseTo(0.1, 2);
    expect(calculateStepRatio(1, 2, 0.1)).toBeCloseTo(0.1, 2);
    expect(calculateStepRatio(0, 100, 0.2)).toBeCloseTo(0.002, 4);
  });
});