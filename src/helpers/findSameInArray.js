// Returns ids of items with the same value as value of item with 'compareIndex' index
function findSameInArray (array, compareIndex) {
  const sliders = [];

  array.forEach((value, index) => {
    if (value === array[compareIndex]) {
      sliders.push(index);
    }
  });

  return sliders;
}

export default findSameInArray;