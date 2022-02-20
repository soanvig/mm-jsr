export const isTruthy = <T>(v: null | undefined | T): v is T => {
  return Boolean(v);
};