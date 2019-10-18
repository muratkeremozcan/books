var assert = require('assert');

function multiMax(first, ...remainingNumbers){ // rest parameters are prefixed with ...
  var sorted = remainingNumbers.sort(function(a, b){  // this sort is for reverse sorting: greatest to smallest number
    console.log(a);
    console.log(b);
    console.log('returns', b-a + '\n');

    // for usual (lowest to greatest sort) : return a-b
    // for reverse (greatest to lowest sort): return b-a

    // if return is NEGATIVE, LEAVE IT
    // if return is POSITIVE, PUSH a RIGHT
    // sort the numbers: by default sorts them in unicode, but a return operator makes it behave differently
    return b-a;
  });
  console.log(sorted);
  return first * sorted[0]; // multiply first with the largest of of the ...remainingNumbers
}
multiMax(3, 1, 2, 3);

// 3 gets assigned to first, the rest assigned to ...remainingNumbers
assert(multiMax(3, 1, 2, 3) == 9, console.log("3*3 = 9 (First arg * largest.)"));

// DIFFERENT NUMBER OF ARGUMENTS THAN PARAMETERS
function practice(ninja, weapon, technique){
  console.log(ninja, weapon, technique);
}
practice("Yoshi", "sword", "shadowSword", "NOT ASSIGNED"); // extra arguments are not assigned
practice("Yoshi"); // if less arguments are passed in, those parameters evaluate as undefined

