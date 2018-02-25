import listenOn from './listenOn';

describe('listenOn', () => {
  function createMockElement () {
    return {
      addEventListener: jest.fn()
    };
  }

  describe('if provided element is not array', () => {
    let mockElement;

    beforeEach(() => {
      mockElement = createMockElement();
    });

    it('should add event listener with desired callback to that element', () => {
      const mock = jest.fn();
      listenOn(mockElement, 'foo', mock);

      expect(mockElement.addEventListener).toBeCalledWith('foo', mock);
    });
  });

  describe('if provided element is array', () => {
    let mockElements;

    beforeEach(() => {
      mockElements = [0, 1, 2].map(() => createMockElement());
    });

    it('should add event listener with desired callback to all elements', () => {
      const mock = jest.fn();
      listenOn(mockElements, 'foo', mock);

      expect(mockElements[0].addEventListener).toBeCalledWith('foo', mock);
      expect(mockElements[1].addEventListener).toBeCalledWith('foo', mock);
      expect(mockElements[2].addEventListener).toBeCalledWith('foo', mock);
    });
  });

  describe('if provided element is nested array', () => {
    let mockElements;

    beforeEach(() => {
      mockElements = [0, 1].map(() => createMockElement());
      mockElements[1] = [0].map(() => createMockElement());
    });

    it('should add event listener with desired callback to all elements', () => {
      const mock = jest.fn();
      listenOn(mockElements, 'foo', mock);

      expect(mockElements[0].addEventListener).toBeCalledWith('foo', mock);
      expect(mockElements[1][0].addEventListener).toBeCalledWith('foo', mock);
    });
  });
});