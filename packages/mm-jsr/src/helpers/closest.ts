type Index = number;

/**
 * Find index of value form set closest to the given `toValue`
 */
export const closest = (toValue: number, values: number[]): Index => values.reduce((currentIndex, value, index) => {
  const currentDiff = Math.abs(values[currentIndex] - toValue);
  const diff = Math.abs(value - toValue);

  return currentDiff < diff ? currentIndex : index;
}, 0);