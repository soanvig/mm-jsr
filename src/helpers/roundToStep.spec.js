import roundToStep from './roundToStep';

describe('roundToStep', () => {
  it('should round value to be multiple of step', () => {
    expect(roundToStep(5, 1)).toBe(5);
    expect(roundToStep(5.1, 1)).toBe(5);
    expect(roundToStep(5.5, 1)).toBe(6);
    expect(roundToStep(5.5, 0.1)).toBeCloseTo(5.5, 1);
    expect(roundToStep(5.5, 0.01)).toBeCloseTo(5.5, 1);
    expect(roundToStep(5.51, 0.02)).toBeCloseTo(5.52, 2);
  });
});