// BIGGEST FRUSTRATION with JS is implicit binding (rule 2)
// !!implicit binding is lost when assigning a function to a variable or passing it as an argument to a function!!
// the binding falls back to the default binding: global object or undefined if strict mode.


function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

// careful! Assign the function to a variable, and the binding falls to undefined
var bar = obj.foo; // undefined

  // note: if you instead call foo by doing:  obj.foo(), 
  // it will execute the function foo here returning console.log('2'), 
  // and bar will have the called obj.foo() value, which will still be undefined
// this is all because the call site is what matters, and bar is in global space

// here the value of bar is function foo
 bar;
 // however, when calling bar with (), the call site is bar in global space and the binding falls to undefined
 bar(); //?

////////////////////////////////

// implicit binding is also lost when passing a function as an argument to another function (callback)
  // Parameter passing is just an implicit assignment (RHS), and since we’re passing a function to another function in global space, 
  // we lose the implicit binding

function doFoo(fn) {
  fn(); // the call site
}

// careful! pass a function as an argument to another function (callback), and the binding falls to undefined

doFoo(obj.foo); // undefined

setTimeout(obj.foo, 100); // still undefined, setTimeout is just an in-built function 


///// 

// only when we use siteTimeout the proper way: 
  // pass in a function that returns the value of called obj.foo  ( obj.foo() ), then it works
  // because then the call site of obj.foo() is obj, and a = 2 there
setTimeout(function () {  // 2
  return obj.foo();
}, 100);

