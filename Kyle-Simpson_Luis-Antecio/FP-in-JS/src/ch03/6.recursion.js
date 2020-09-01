// imperative to functional adder


const nums = [1, 2, 3, 4, 5];

{ // fully imperative
  let acc = 0;
  for (let i = 0; i < nums.length; i++) {
    acc = acc + nums[i];
  }
  acc; //?
}

{ // functional
  nums.reduce((acc, curr) => acc + curr, 0); //? 
}

import _ from 'lodash';
{ // with recursion
  function sum(arr) {
    if (_.isEmpty(arr)) { // Base case (also known as the terminating condition) 
      return 0;
    }
    return _.first(arr) + sum(_.tail(arr)); // Recursive case
  }
  sum(nums); //?
}
{ // recursive addition 2 (proper tail call / PTC) 
  // places the recursive call as the last step in the function body, instead of : recursive call + something
  function sum(arr, acc = 0) {
    if (_.isEmpty(arr)) {
      return acc;
    }
    // _.tail(arr); //?
    // acc + _.first(arr); //?
    return sum(_.tail(arr), acc + _.first(arr));
  }
  sum(nums); //?
}
