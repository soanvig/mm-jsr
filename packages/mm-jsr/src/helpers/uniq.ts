/**
 * Filter out duplicate from list using strict equality.
 */
export const uniq = <T>(arr: T[]): T[] => {
  return [...(new Set(arr))];
};