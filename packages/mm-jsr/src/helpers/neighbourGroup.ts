/**
 * Group entries into neighbouring pairs.
 * 
 * @example
 * [1,2,3] -> [[1,2], [2,3]]
 */
export const neighbourGroup = <T>(arr: T[]): T[][] => {
  if (arr.length < 2) {
    return [];
  }

  return [
    arr.slice(0, 2),
    ...neighbourGroup(arr.slice(1)),
  ];
};
