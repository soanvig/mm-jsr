/**
 * Maps input through `cb` function, but only entries whose index is specified in `changedIndexes`
 */
export const mapChanged = <T>(input: T[], changedIndexes: number[], cb: (item: T, index: number, processed: T[]) => T): T[] =>
  input.map((value, index, processed) => {
    if (changedIndexes.includes(index)) {
      return cb(value, index, processed);
    } else {
      return value;
    }
  });