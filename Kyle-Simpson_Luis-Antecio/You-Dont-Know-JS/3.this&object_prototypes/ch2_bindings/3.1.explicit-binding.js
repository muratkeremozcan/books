// (binding rule 3) explicit binding

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
}

foo(); // undefined
// Invoking foo with explicit binding by foo.call(..) allows us to force its this to be obj.

// call invokes the method with specified 'this' context, with passed in optional parameter(s)
foo.call(obj); // 2
foo.apply(obj); // 2
// With respect to this binding, call(..) and apply(..) are identical. They do behave differently with their additional parameters,
//  Both can be called on functions, which they run in the context of the first argument. 
// In call the subsequent arguments are passed in to the function as they are, 
// while apply expects the second argument to be an array that it unpacks as arguments for the called function