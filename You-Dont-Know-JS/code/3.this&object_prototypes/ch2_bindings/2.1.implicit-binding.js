// (binding rule 2) implicit binding

// When there is a context object for a function reference, the implicit binding rule says that 
  // it’s that object that should be used for the function call’s this binding.

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

// foo is added as a reference property onto obj
  // the call-site uses the obj context to reference the function,
obj.foo();


// Only the top/last level of an object property reference chain matters to the call-site.

var obj2 = {
  a: 42,
  foo: foo
};

var obj1 = {
  a: 2,
  obj2: obj2
};

// only obj2 matters
obj1.obj2.foo(); // 42

