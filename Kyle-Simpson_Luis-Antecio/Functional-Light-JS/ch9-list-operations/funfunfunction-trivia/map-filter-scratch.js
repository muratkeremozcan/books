var numbers = [5, 6, 7];

// Map
// map applies the cb function to every element in the array and returns a new array
numbers.map(num => num + 2); //?

// functional programming version (single point style, separated concerns)
const addTwo = num => num + 2;
numbers.map(addTwo); //?


// map from scratch
function mapArray(transform, array) {
  let transformedArray = [];
  for(let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    const transformed = transform(currentItem);
    transformedArray.push(transformed);
  }
  return transformedArray;
}

mapArray(addTwo, numbers); //?


//// Filter
// tests the condition and returns passing result
numbers.filter(num => num > 6); //?

// FP single point style
const moreThanFive = num => num > 5;
numbers.filter(moreThanFive); //?


// filter from scratch
function filterArray(predicate, array) {
  let filteredArray = [];
  for(let i = 0; i < array.length; i++) {
    const currentItem = array[i]; //?
    if (predicate(currentItem)) {
      filteredArray.push(currentItem);
    }
  }
  return filteredArray;
}

filterArray(moreThanFive, numbers); //?