// generating records from a data source is a very common design pattern, usually solved by iterators
// An iterator is a well-defined interface for stepping through a series of values from a producer. 
// The JS interface for iterators, as it is in most languages, is to call next() each time you want the next value from the producer.

// here is how we make our iterator interface
var something = (function () {
  var nextVal;
  return {
    // needed for `for..of` loops
    // As of ES6, the way to retrieve an iterator from an iterable is that the iterable must have a function on it, with the name being the special ES6 symbol value [Symbol.iterator].
    // TL,DR; this code makes 'something' value an iterator and iterable, so we can pass it to the for of loop
    [Symbol.iterator]: function () { 
      return this; 
    },
    // standard iterator interface method
    next: function () { // this function is the same as the previous example
      nextVal; //?
      if (nextVal === undefined) {
        nextVal = 1;
      }
      else {
        nextVal = (3 * nextVal) + 6;
      }
      nextVal; //?
      return { done: false, value: nextVal };
    }
  };
})();

something.next().value; //? 
something.next().value; //? 
something.next().value; //? 

// ES6 also adds the for..of loop, which means that a standard iterator can automatically be consumed with native loop syntax.
// The for..of loop automatically calls next() for each iteration — it doesn’t pass any values in to the next() 
// — and it will automatically terminate on receiving a done:true. It’s quite handy for looping over a set of data.
for (var v of something) {
  if (v > 2000) { // need break because the iterator would run forever with done: false
    break;
  }  
  v; //?
}

// you could do this manually, calling next() and checking for the done:true condition to know when to stop
for (var ret; (ret = something.next()) && !ret.done; ){
  if (ret.value > 50000) {
    break;
  }
  ret.value; //?
}


// //////////////
// many built-in data structures in JS also have default iterators
var a = [1,3,5,7,9];
for(var v of a) {
  v; //?
}
// The for..of loop automatically calls its Symbol.iterator function to construct an iterator. 
// But we could of course call the function manually, and use the iterator it
var it = a[Symbol.iterator](); //?
it.next().value; //?
it.next().value; //?
it.next().value; //?