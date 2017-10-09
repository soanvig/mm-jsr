import { listenOn, throttle, calculateDecimals } from '../src/assets/js/helpers.js';

describe('test calculateDecimals', () => {
  test('input as integer', () => {
    const input = 2;
    const result = calculateDecimals(input);
    expect(result).toBe(0);
  });

  test('input as float', () => {
    const input = 2.12;
    const result = calculateDecimals(input);
    expect(result).toBe(2);
  });
});

describe('test listenOn', () => {
  let testElements = [];

  beforeEach(() => {
    for(let i = 0; i < 2; i += 1) {
      testElements.push(document.createElement('div'));
    }
  });
  
  afterEach(() => {
    testElements = [];
  });

  test('single element input', () => {
    let eventLaunched = false;
    const event = new MouseEvent('click');

    listenOn(testElements[0], 'click', () => {
      eventLaunched = true;
    });

    testElements[0].dispatchEvent(event);

    expect(eventLaunched).toBe(true);
  });

  test('array element input', () => {
    let eventLaunched = false;
    const event = new MouseEvent('click');

    listenOn(testElements, 'click', () => {
      eventLaunched = true;
    });

    testElements[testElements.length - 1].dispatchEvent(event);

    expect(eventLaunched).toBe(true);
  });
});