// constant is a variable that cannot be reassigned
// The use of const tells the reader of your code that that variable will not be reassigned.

{
  // here the value is not being re-assigned
  const x = [2];
  // x is not reassignable, but the value of x is still mutable!
  // x cannot be reassigned, however the array it points to can still change!
  x[0] = 3;
  x; //?
}
// can assign x in this scope
const x = 5; //?
// you should use var or let for declaring variables to hold values that you intend to mutate
// const makes efforts to adhere to FP harder


// how can you turn a mutable object/ array/ function into an “immutable value”; create an immutable array?
// The Object.freeze(..) utility goes through all the properties/ indices of an object/ array and marks them as read-only, so they cannot be reassigned

let y = Object.freeze([2]);
y[0] = 3; 
y; //?

// Object.freeze applies to top level only: shallow immutability
let z = Object.freeze([2,3,[4,5]]);
z[0] = 42; //?
// ok here, z is frozen
z; //?

// but can reassign deeper!
z[2][0] = 42; //?
z


/* Performance chapter summary
If we have to reallocate a new array each time we need to add to it, that’s not only churning CPU time and consuming extra memory; 
the old values (if no longer referenced) are also being garbage collected.

Think about a specialized data structure that’s like an array, but that you want to be able to make changes to
and have each change behave implicitly as if the result was a new array. How could you accomplish this without actually creating a new array each time?
Such a special array data structure could store the original value and then track each change made as a delta from the previous version.

The key idea is that at each mutation, only the change from the previous version is recorded, not a duplication of the entire original data structure. 
This approach is much more efficient in both memory and CPU performance, in general.

Use a library like Immutable.js, which provides a variety of data structures, including List (like array) and Map (like object).


var state = Immutable.List.of( 4, 6, 1, 1 ); 
var newState = state.set( 4, 2 ); 

state === newState; // false 
state.get( 2 ); // 1 
state.get( 4 ); // undefined 

newState.get( 2 ); // 1 
newState.get( 4 ); // 2 

newState.toArray().slice( 2, 5 ); // [1,1,2]

*/