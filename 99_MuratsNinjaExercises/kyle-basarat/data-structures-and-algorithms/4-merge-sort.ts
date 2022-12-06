// 04:57 - Merge Sort
// https://www.youtube.com/watch?v=RcvQagxK_9w&list=WL&index=5

/*
Here is how Merge Sort works:

- It accepts an unsorted array.
- Divides the array smaller pieces one step at a time.
- Sorts them.
- Merges them back to build a completely sorted array.
- To do this, it recursively uses merge() method
*/

const someArray = [3, 14, 7, 11, 6, 1, 21, 9, 14, 15];

// [1, 4, 2, 8, 345]
// [1] [4] [2] [8] [345]
// [1, 4] [2, 8] [345]
// [1, 2, 4, 8] [345]
// [1, 2, 4, 8, 345]

// sorting helper
const merge = (leftArr: any[], rightArr: any[]): any[] => {
  let output = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // compare the the 2 arrays starting at index 0
  // keep pushing the smaller of the 2 pieces of the data to the output array
  while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
    const leftEl = leftArr[leftIndex];
    const rightEl = rightArr[rightIndex];

    if (leftEl < rightEl) {
      output.push(leftEl);
      leftIndex++;
    } else {
      output.push(rightEl);
      rightIndex++;
    }

    // output //?
  }

  // finish building the output array
  // and at the end, combine the output array with the remaining arrays
  // output //?
  // leftArr.slice(leftIndex) ; //?
  // rightArr.slice(rightIndex) ; //?

  return [
    ...output,
    ...leftArr.slice(leftIndex),
    ...rightArr.slice(rightIndex),
  ];
};

merge([3, 6], [2, 4]); //?
merge([3, 6], [11, 15]); //?
merge([11, 15], [3, 6]); //?

// main function
const mergeSort = (arr: any[]): any[] => {
  // keep dividing the array in half until it is 1 element
  if (arr.length <= 1) return arr;

  const pivot = Math.floor(arr.length / 2);
  const left = arr.slice(0, pivot);
  const right = arr.slice(pivot, arr.length);

  // merge each sorted sub-array together
  return merge(mergeSort(left), mergeSort(right));
};

mergeSort(someArray); //?
