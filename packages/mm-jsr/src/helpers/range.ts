/**
 * Compute list of numbers between `a` and `b`.
 */
export const range = (a: number, b: number = 0): number[] => {
  if (a === 0 && b === 0) {
    return [];
  }

  const result: number[] = [];

  for (let i = Math.min(a, b); i <= Math.max(a, b); i += 1) {
    result.push(i);
  }

  return result;
};