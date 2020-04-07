// concise properties
// If you need to define a property that is the same name as a lexical identifier, you can shorten it
var x = 2, y = 3,
  o = {
    x, // x: x
    y  // y: y
  }

// concise methods
// functions attached to properties in object literals also have a concise form,
var o = {
  x() { /* */ },  // x: function() {..}
  y() { /* */ },   // y: function() {..}
  *foo() { /* */ } // foo: *function() {..} // generator
}


////
// TL, DR; you still need named functions with recursive functions

function runSomething(o) {
  var x = Math.random(),
  y = Math.random();
  
  return o.something(x, y);
}

// The property something is how we can call o.something(..),
// But the second something is a lexical name to refer to the function from inside itself, for recursion purposes.
runSomething({
  something: function something(x, y) {
    // do not use ES6 concise method: something(x, y)... because the recursion with "return something(y, x) will break with Reference error
    x; 
    y;
    if (x > y) { // recursively call x and y swapped
      return something(y, x); //?
    }
    return y - x; //?
  }
}); //?

// what if you do not refer to the function by name? Don't do this. 
// A common practice when object literal has an identifying name:
var controller = {
  makeRequest: function() {
    // controller.makeRequest(); 

    // better to use 'this', but still not very good. 
    // Use named functions for a lexical identifier that will always point to the function itself
    this.makeRequest();
  }
}