import findSameInArray from './findSameInArray';

describe('findSameInArray', () => {
  describe('when provided with empty array', () => {
    it('should always return empty array', () => {
      expect(findSameInArray([], 2)).toEqual(expect.arrayContaining([]));
    });
  });

  describe('when provided non-empty array', () => {
    describe('when array is number-only', () => {
      it('should return ids of values equal to desired value', () => {
        expect(findSameInArray([1], 0)).toEqual(
          expect.arrayContaining([0])
        );
        expect(findSameInArray([1, 1, 1], 0)).toEqual(
          expect.arrayContaining([0, 1, 2])
        );
        expect(findSameInArray([1, 2, 3], 0)).toEqual(
          expect.arrayContaining([0])
        );
        expect(findSameInArray([1, 1, 2, 2, 3, 3], 2)).toEqual(
          expect.arrayContaining([2, 3])
        );
      });
    });

    describe('when array has mixed types', () => {
      it('should return ids of values which match type', () => {
        expect(findSameInArray([1, '1', 2, 2, 3, 3], 0)).toEqual(
          expect.arrayContaining([0])
        );
        expect(findSameInArray(['1', '1', 2, 2, 3, 3], 0)).toEqual(
          expect.arrayContaining([0, 1])
        );
      });
    });
  });
});