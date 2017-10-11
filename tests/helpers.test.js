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

describe('test throttle', () => {
  jest.setTimeout(5000);

  test('expected single immidiate execution', () => {
    jest.useFakeTimers();
    
    throttle('throttle_test_1', 500, () => {});
    expect(setTimeout.mock.calls.length).toBe(1);
  });

  test('expected 2 executions with 6 tries', () => {
    const callback = jest.fn();
    jest.useFakeTimers();

    // 5 times execution
    for (let i = 0; i < 5; i += 1) {
      throttle('throttle_test_2', 500, callback);
    }

    expect(setTimeout.mock.calls.length).toBe(1);

    // Release lock
    jest.runTimersToTime(1000);
    
    // After releasing the lock try once more
    throttle('throttle_test_2', 500, callback);

    expect(setTimeout.mock.calls.length).toBe(2);
  });

  test('expected 1 executions with 6 tries (without releasing lock)', () => {
    const callback = jest.fn();
    jest.useFakeTimers();

    // 5 times execution
    for (let i = 0; i < 5; i += 1) {
      throttle('throttle_test_3', 500, callback);
    }

    expect(setTimeout.mock.calls.length).toBe(1);

    // Don't release lock
    jest.runTimersToTime(200);
    
    // After "releasing" the lock try once more
    throttle('throttle_test_3', 500, callback);

    expect(setTimeout.mock.calls.length).toBe(1);
  });
});