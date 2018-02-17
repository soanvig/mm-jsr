import calculateDecimals from './calculateDecimals';

// Rounds value to step
function roundToStep (value, step) {
  const stepDecimals = calculateDecimals(step);
  const stepDecimalsMultiplier = Math.pow(10, stepDecimals);

  value = Math.round(value / step) * step;

  return Math.round(value * stepDecimalsMultiplier) / stepDecimalsMultiplier;
}

export default roundToStep;