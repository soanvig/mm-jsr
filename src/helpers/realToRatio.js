// Converts real value to ratio value used by script
function realToRatio (min, max, value) {
  return (value - min) / (max - min);
}

export default realToRatio;