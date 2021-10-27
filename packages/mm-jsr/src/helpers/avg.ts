/**
 * Compute average of numbers.
 */
export const avg = (...numbers: number[]): number =>
  numbers.reduce((sum, r) => sum + r, 0) / numbers.length;