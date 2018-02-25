import ratioToReal from './ratioToReal';

describe('ratioToReal', () => {
  it('should convert ratio number to real number from min-max range, rounded to step', () => {
    expect(ratioToReal(0, 10, 0.1, 1)).toBeCloseTo(1, 1);
    expect(ratioToReal(0, 10, 0.13, 1)).toBeCloseTo(1, 1);
    expect(ratioToReal(0, 10, 0.16, 1)).toBeCloseTo(2, 1);
    expect(ratioToReal(0, 10, 0.16, 0.1)).toBeCloseTo(1.6, 2);
    expect(ratioToReal(0, 10, 0.16, 0.001)).toBeCloseTo(1.6, 4);
  });
});