
function getY(x) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve((3 * x) - 1);
    }, 100);
  });
}

function foo(bar, baz) {
  var x = bar * baz;

  // return both promises
  return [
    Promise.resolve(x),
    getY(x)
  ];
}
// one value per promise mantra!
foo(10,20); //?


// unwrap with neat tricks
function spread(fn) {
  // .apply() accepts two arguments, the context (what would become this inside of the target function) and an iterable of arguments 
  // .bind() takes a context (what would become this), and optionally, additional arguments, and returns a new function, with the context bound, and the additional arguments locked
  // apply() is a function itself, so it can be bound with bind()
  // meaning that the this of .apply() would be fn and the first argument to .apply() would be null 
  // Meaning that it would look like this: fn.apply(null, args)  which spreads the parameters from an array
  return Function.apply.bind(fn, null);
}
// unwrap with Promise.all
Promise.all(foo(10, 20)).then(
  spread(function (x, y) {
    x; //?
    y; //?
  })
)

// easier with ES6 destructuring
Promise.all(foo(10, 20)).then(
  function (msgs) {
    var [x, y] = msgs;
    x; //?
    y; //?
  }
)
// even better with array parameter destructuring form
Promise.all(foo(10, 20)).then(
  function ([x, y]) {
    x; //?
    y; //?
  }
)