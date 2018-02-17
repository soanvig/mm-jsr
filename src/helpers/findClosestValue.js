// Returns id of value in this.values, which is closest to `lookupVal`
function findClosestValue (values, lookupVal) {
  let diff = 1;
  let id = 0;

  values.forEach((value, index) => {
    const actualDiff = Math.abs(value - lookupVal);
    if (actualDiff < diff) {
      id = index;
      diff = actualDiff;
    }
  });

  return id;
}

export default findClosestValue;