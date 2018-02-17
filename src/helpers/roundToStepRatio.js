import calculateDecimals from './calculateDecimals';

// Rounds value to step ratio
function roundToStepRatio (value, stepRatio) {
  const stepRatioDecimals = calculateDecimals(stepRatio);
  const stepDecimalsMultiplier = Math.pow(10, stepRatioDecimals);

  value = Math.round(value / stepRatio) * stepRatio;

  return Math.round(value * stepDecimalsMultiplier) / stepDecimalsMultiplier;
}

export default roundToStepRatio;