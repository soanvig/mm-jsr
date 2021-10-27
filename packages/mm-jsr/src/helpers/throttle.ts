/**
 * Throttling function.
 */
export const throttle = <P, T extends (...args: any[]) => P>(f: T, time: number) => {
  let isLocked = false;

  return (...args: Parameters<T>) => {
    if (!isLocked) {
      f(...args);
      setTimeout(() => isLocked = false, time);
    }
  };
};