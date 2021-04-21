import { range } from '@/helpers/range';

export const times = <T>(n: number, cb: (n: number) => T): T[] => {
  if (n < 1) {
    return [];
  }

  return range(1, n).map(cb);
};