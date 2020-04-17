function foo() {
  return this.a;
}

const obj = {
  a: 2,
  foo
}

// with an arrow function, the scope is lexical to the function; not dynamic to the call site
const bar = () => obj.foo();
bar(); //?
// if  you pass in a function that returns the value of called obj.foo  ( obj.foo() ), then it works
const baro = function () {
  return obj.foo();
}
baro(); //?
function barometer() {
  return obj.foo();
}
barometer(); //?

// you can also work around it with call apply and bind; the scope is set explicitly to obj

// we are not returning a called function with call, apply, bind
const baz = obj.foo;
baz.call(obj, null); //?
baz.apply(obj); //?
baz.bind(obj)(); //?

// returning a called function, as in the arrow function example
const barf = function () {
  return obj.foo();
}
barf(); //?
barf.call(obj, null); //?
barf.apply(obj); //?
barf.bind(obj)(); //?


///////////////
//////// passing a function as an argument


function doFoo(fn) {
  return fn();
}

// returns undefined because the call site is global
doFoo(obj.foo); //?
// works with arrow
doFoo(bar); //?
// still works with regular functions if you're returning the called value obj.foo()
doFoo(baro); //?
doFoo(barometer); //?


// with call apply bind, you also have to return functions (these were before arrow functions so you have to explicitly return)
const caller = function () {
  return obj.foo.call(obj, null);
}
const applier = function () {
  return obj.foo.apply(obj);
}
const binder = function () {
  return obj.foo.bind(obj)();
};

doFoo(caller); //?
doFoo(binder); //?
doFoo(applier); //?


// what if you were not returning the called value?
// couldn't figure this out...

const newBar = () => obj.foo;
obj; //?

newBar(); //?
newBar().a; //?
newBar.bind(obj)(); //?

newBar().bind(this); //?
newBar().bind(obj); //?
newBar().bind(obj).a; //?

