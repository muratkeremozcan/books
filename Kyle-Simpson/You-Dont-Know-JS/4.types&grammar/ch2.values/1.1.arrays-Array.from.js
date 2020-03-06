// an array can include a number, string, array or object
var a = [ 1, '2', [3], {b: 4}]; 
a.length; //?
a[2][0]; //?
a[3].b;//?

// careful with empty slots using delete 
a[1] = undefined;
a//?
a.length; //?

// if a string value is passed in and it can be coerced as a number, it is assumed as a number index
var b = [];
b['13'] = 42;
b;//?
b.length; //?


// conversion: array-like to array using SLICE

function foo(){
  // If slice() is called without any other parameters, the default values for its parameters have the effect of duplicating the array
  // var arr = Array.prototype.slice.call( arguments );
  
  // ES6 version
  var arr = Array.from(arguments);
  
  arr.push('bam');
  console.log( arr );
}
foo('bar', 'baz');


// MODIFYING ARRAYS
var ar = [1, 2, 3, 4, 5, 6];

// pop : remove from end
ar.pop(); //?
ar; //?

// shift : remove from beginning
ar.shift(); //?
ar; //?

// unshift : insert to beginning
ar.unshift(1); //?
ar; //?

// push : insert to end
ar.push(6); //?
ar; //?

// modify the middle of an array
// splice : (index, howManyRemoved, <opt>whatsAdded)

ar.splice(2, 1); //?
ar; //?

ar.splice(2, 0, 3); //?
ar;

var ar_b = ar.splice(arguments) ; //?
ar_b; //?


// remove by value from an array
var arr = [1, 2, 3, 4, 5, 5, 6, 7, 8, 5, 9, 0];

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 5) {
    arr.splice(i, 1);
    i--; // need this workaround because as the items are removed from the array the index still increments and the next item after your matched value is skipped.
  }
}
arr; //?

// or decrement, so that you don not need the workaround
for ( let i = arr.length-1; i--;) {
  if (arr[i] === 5) {
    arr.splice(i, 1);
  }
}
arr;


// better using array.filter
arr = [1, 2, 3, 4, 5, 5, 6, 7, 8, 5, 9, 0];
arr.filter( (i) => i !== 5 ); //?
arr; 

// or you can use lodash remove https://lodash.com/docs/4.17.15#remove
// the distinction there is that the original array is also modified
