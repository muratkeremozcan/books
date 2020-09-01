function sum(total, ...nums) {
  for (let num of nums) {
    total = total + num;
  }
  return total;
}
sum(1, 5); //?


// It’s not just that the for-loop is eliminated in favor of the call stack, 
// but that the incremental partial sums (the intermittent state of total) 
// are tracked implicitly across the returns of the call stack instead of reassigning total each iteration.

function sum_(num1, ...nums) {
  if (nums.length == 0) return num1;
  return num1 + sum_(...nums);
}
sum_(1, 5); //?


/////
// Recursion is declarative for algorithms in the same sense that Σ is declarative for mathematics. 
// Recursion expresses that a problem solution exists, 
// but doesn’t necessarily require the reader of the code to understand how that solution works.

// find the highest even number passed as an argument

{ // semi-recursive approach; not interactable
  function maxEven(...nums) {
    var maxNum = -Infinity;

    for (let num of nums) {
      num;
      if (num % 2 == 0 && num > maxNum) {
        num
        maxNum = num;
      }
    }
    if (maxNum !== -Infinity) {
      maxNum
      return maxNum;
    }
  }
  maxEven(1, 2, 3, 4, 5); //?
}

{ // full recursive approach : all the looping logic is abstracted into the recursive call stack
  // When we can make the recursive definition more apparent even in the function signature, 
  // we improve the declarativeness of the function.

  function maxEven(num1, ...restNums) {
    var maxRest = restNums.length > 0
    ? maxEven(...restNums)
    : undefined;
    restNums; 
    maxRest; //?
    num1;
    return (num1 % 2 != 0 || num1 < maxRest)
      ? maxRest
      : num1;
  }
  maxEven(1, 2, 3, 4, 5); //?

}