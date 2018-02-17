// Calculates step in terms of ratio
function calculateStepRatio (min, max, step) {
  return (step / (max - min));
}

export default calculateStepRatio;