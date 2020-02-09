// If the nature of the concerned side causes/effects is with case of function mutating an outer data structure
// move the side effect outside the function

{ // impure function example
  function addMaxNum(arr) {
    let maxNum = Math.max(...arr);
    arr.push(maxNum + 1); 
  }
  let nums = [4, 2, 7, 3];

  addMaxNum(nums);

  nums;//?
}


{ // since this function does not mutate the array, it is a pure function now
  function addMaxNum(arr) {
    let maxNum = Math.max(...arr);
    return maxNum + 1;
  }
  let nums = [4, 2, 7, 3];

  nums.push(addMaxNum(nums)); // the side effect is now outside the function

  nums; //?
}

