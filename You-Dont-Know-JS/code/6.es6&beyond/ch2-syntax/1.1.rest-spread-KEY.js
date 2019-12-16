function foo(x, y, z) {
  console.log(x, y, z);
}
// (1, spread - FUNCTION CALLS) When ... is used in front of an array (or any iterable) it acts to “spread” it out into its individual values.
// You’ll typically see this usage when spreading out an array as a set of arguments to a function call.
foo(...[1, 2, 3]);
// pre-es6 was not simple
foo.apply(null, [1, 2, 3]);


// (2, spread) it can be used to spread out / expand a value in other contexts as well, such as inside another array declaration:
var a = [2, 3, 4];
var b = [1, ...a, 5]; //?
// pre-ES6 was not simple
var c = [1].concat(a, 5); //?


// (3, rest - FUNCTION DECLARATIONS) essentially the opposite; instead of spreading a value out, the ... gathers a set of values together into an array
function foof(x, y, ...z) { // “gather the rest of the arguments (if any) into an array called z.”
  console.log(x, y, z);
}
foof(1, 2, 3, 4, 5);


// if you don’t have any named parameters, the ... gathers all arguments
function bar(...args) {
  console.log(args);
}
bar(1, 2, 3, 4, 5);

// pre-es6 was not simple, you had to create an array from the arguments
function baro() {
  let args = Array.prototype.slice.call(arguments);
  console.log(args);
}

baro(1, 2, 3, 4, 5);