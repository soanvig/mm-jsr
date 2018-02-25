import roundToStepRatio from './roundToStepRatio';

describe('roundToStepRatio', () => {
  it('should round number to step ratio', () => {
    expect(roundToStepRatio(10, 0.1)).toBeCloseTo(10, 1);
    expect(roundToStepRatio(10.1, 0.1)).toBeCloseTo(10.1, 1);
    expect(roundToStepRatio(10.15, 0.1)).toBeCloseTo(10.2, 1);
  });
});