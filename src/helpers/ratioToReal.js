import roundToStep from './roundToStep';

// Converts ratio value used by script to real value from min/max
function ratioToReal (min, max, value, step) {
  value = (max - min) * value + min;

  return roundToStep(value, step);
}

export default ratioToReal;