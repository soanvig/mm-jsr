export const neighbourGroup = <T>(arr: T[]): T[][] => {
  if (arr.length < 2) {
    return [];
  }

  return [
    arr.slice(0, 2),
    ...neighbourGroup(arr.slice(1)),
  ];
};
