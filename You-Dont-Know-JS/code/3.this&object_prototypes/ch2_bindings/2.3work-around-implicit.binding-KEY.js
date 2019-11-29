function foo() {
  return this.a; //?
}

const obj = {
  a: 2,
  foo
}

// with an arrow function, the scope is lexical to the function; not dynamic to the call site
const bar = () => obj.foo();
bar(); //?


// you can also work around it with call apply and bind; the scope is set explicitly to obj

// not returning a called function
const baz = obj.foo;
baz.call(obj, null); //?
baz.apply(obj); //?
baz.bind(obj)(); //?

// returning a called function, as in the arrow function example
const barf = function() {
  return obj.foo();
}
barf.call(obj, null); //?
barf.apply(obj); //?
barf.bind(obj)(); //?


///////////////
//////// passing a function as an argument

function doFoo(fn) {
  fn();
}

doFoo(obj.foo); // returns undefined because the call site is global
doFoo(bar); // works!

// with call apply bind, you have to return functions (these were before arrow functions so you have to explicitly return)
const caller = function() {
  return baz.call(obj, null);
}
const applier = function() {
  return baz.apply(obj);
}
const binder = function() {
  return baz.bind(obj)();
};

doFoo(caller);
doFoo(binder); 
doFoo(applier);