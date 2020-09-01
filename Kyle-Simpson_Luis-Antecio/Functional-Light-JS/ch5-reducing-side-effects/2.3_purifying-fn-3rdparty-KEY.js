// sometimes you cannot modify the function to encapsulate free variables inside the scope of a wrapper function
// ex: the impure function may be a 3rd party library

var nums = [1,2,3];
var smallCount = 10;
var largeCount = 10;

// sample '3rd party' library
export function generateMoreRandom(count) {
  for (let i = 0; i < count; i++) {
    let num = Math.random();

    if (num >= 0.5) {
      largeCount++;
    }
    else {
      smallCount++;
    }
    nums.push(num); 
  }
}
// generateMoreRandom(2);
// nums; //?
// smallCount; //?
// largeCount; //?


///////////////////

function safer_generateMoreRandom(count, initial) {
  // (1) Save original state
  var orig = {
    nums,
    smallCount,
    largeCount
  }; //?
  // (2) Set up initial pre-side effects state
  nums = [...initial.nums]; //?
  smallCount = initial.smallCount; //?
  largeCount = initial.largeCount; //?
  // (3) Run the impure function
  generateMoreRandom(count);
  // (4) Capture side effects state
  var sides = {
    nums,
    smallCount,
    largeCount
  }; //?
  // (5) Restore original state
  nums = orig.nums; //?
  smallCount = orig.smallCount; //?
  largeCount = orig.largeCount; //?
  // (6) Return the captured side effect states
  return sides; //?
}

// usage
// initial pre-side effects state:
var initialStates = {
  nums: [0.3, 0.4, 0.5],
  smallCount: 2,
  largeCount: 1
};

safer_generateMoreRandom(2, initialStates); //?
// original state not effected!
nums; //?
smallCount; //
largeCount;


// Note: Asynchronous code can’t reliably be managed with this approach because it can’t prevent surprises if other parts of the program access/ modify the state variables in the interim.
