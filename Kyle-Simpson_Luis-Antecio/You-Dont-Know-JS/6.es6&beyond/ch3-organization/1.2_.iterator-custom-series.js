// custom iterator that is designed to run through a series (aka a queue) of actions, one item at a time:

// The iterator on tasks steps through functions found in the actions array property, if any, 
//  and executes them one at a time, passing in whatever arguments you pass to next(..), 
// and returning any return value to you in the standard IteratorResult object.

var tasks = { 
  actions: [],
  [Symbol.iterator]() {  // [Symbol.iterator]() specifies the default iterator for an object.
    var steps = this.actions.slice(); 
    return { 
      // make the iterator an iterable '
      [Symbol.iterator]() { return this; },

      next(...args) { // spread operator - FUNCTION CALLS
        if (steps.length > 0) {
          let res = steps.shift()(...args); // spread - EXPANDING VALUES
          return { value: res, done: false };
        } else {
          return { done: true }
        }
      },

      return(v) {
        steps.length = 0;
        return { value: v, done: true };
      }
    };
  }
};


// This particular usage reinforces that iterators can be a pattern for organizing functionality, not just data.

tasks.actions.push(
  function step1(x) {
    console.log('step 1: ', x);
    return x * 2; //?
  },
  function step2(x, y) {
    console.log('step 2: ', x, y);
    return x + (y * 2);
  },
  function step3(x, y, z) {
    console.log('step 3: ', x, y, z);
    return (x * y) + z;
  }
);

var it = tasks[Symbol.iterator]();

it.next(10); //?

it.next(20, 50); //?

it.next(20, 50, 120); //?

it.next(); //?


// if you want a crazy example an iterator for numbers that by default ranges from 0 up to (or down to, for negative numbers) the number in question, check out page 95...

