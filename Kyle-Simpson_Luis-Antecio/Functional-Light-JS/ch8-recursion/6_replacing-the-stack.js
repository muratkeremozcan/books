// The main problem with recursion is its memory usage, keeping around the stack frames to track the state of a function call
// while it dispatches to the next recursive call iteration.
// How do we express recursion with Proper Tail Calls and take advantage of JS engine's handling of tail calls?
// The approach is to move recursion to the PTC form to optimize the stack (memory) usage.


/** Sum with recursion. Sums all arguments. */
function sum(num1, ...nums) {
  if (nums.length == 0) return num1;
  return num1 + sum(...nums); // not PTC because num1 +
}

sum(1, 1, 3, 2); //?

// We could remove our dependence on the stack by keeping total in the current function’s stack frame, 
// and push it into the stack frame of the next recursive call

/** Sum with recursion and Proper Tail Call. Sums all arguments. */
function sum_withPTC(num1, num2, ...nums) {
  num1 = num1 + num2; // pre-calculate the addition of num1 and num2, and pass it along
  if (nums.length == 0) return num1;
  return sum_withPTC(num1, ...nums);
}

sum_withPTC(1, 2, 1); //?



///////
// refactor maxEven function with PTC

/* Algorithm strategy to refactor a recursive function with  Proper Tail Call
1. Start by comparing the first two numbers, num1 and num2. 
2. Is num1 even, and is num1 greater than num2? If so, keep num1. 
3. If num2 is even, keep it (store in num1). 
4. Otherwise, fall back to undefined (store in num1).
5. If there are more nums to consider, recursively compare them to num1. 
Finally, just return whatever value is left in num1.
*/

function maxEven(num1, ...restNums) {
  var maxRest = restNums.length > 0
    ? maxEven(...restNums)
    : undefined;

  return (num1 % 2 != 0 || num1 < maxRest)
    ? maxRest
    : num1;
}
maxEven(2, 1, 4); //?

function maxEven_withPTC(num1, num2, ...nums) {
  num1 = (num1 % 2 == 0 && !(maxEven_withPTC(num2) > num1))
    ? num1
    : (num2 % 2 == 0
      ? num2
      : undefined);

  return nums.length == 0
    ? num1
    : maxEven_withPTC(num1, ...nums)
}
maxEven_withPTC(2, 1 ,4); //?