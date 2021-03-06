export const neighbourGroup = <T>(arr: T[]): T[][] => {
  if (arr.length < 2) {
    return [];
  }

  return [
    [arr[0], arr[1]],
    ...neighbourGroup(arr.slice(1)),
  ];
};
