// how do we workaround the frustration with implicit binding?
  // apply & call
// (binding rule 3) hard binding is a variation around explicit binding

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

var bar = function() {
  // call/apply invoke the method with specified 'this' context, with passed in optional parameter(s)
  // functionName.call(objContext, <optional args>)
  foo.call(obj);
  // foo.apply(obj); // same use here
}

// here the value of bar is again function foo
bar; 
// however, when calling bar with (), the context is forced to be obj where a = 2
bar();  


// setTimeout will work the same way
setTimeout(bar , 100);
setTimeout(() => {
  return bar();
}, 100);

// USING CALL vs APPLY
// In call the subsequent arguments are passed in to the function as they are, 
// apply expects the second argument to be an array that is unpacked as arguments for the called function

function foob(something) {
  console.log(this.a, something);
  // return this.a + something; // for the sake of the call vs apply difference, not needed here
}

var barf = function() {
  // apply is useful when we do not know what the argument will be
  // functionName.apply(objContext, <[optional args]>)
  foob.apply(obj, arguments);
  // return this.a + something; // optional here
}

var b = barf(5);
