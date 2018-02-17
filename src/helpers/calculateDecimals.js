// Determines, how many decimal places the (float) number has
function calculateDecimals (number) {
  const string = number.toString().split('.');
  if (string[1]) {
    return string[1].length;
  }

  return 0;
}

export default calculateDecimals;