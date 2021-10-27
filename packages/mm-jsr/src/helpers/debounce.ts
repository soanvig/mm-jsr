/**
 * Typical debounce
 * 
 * @see https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940#gistcomment-3684038
 */
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};