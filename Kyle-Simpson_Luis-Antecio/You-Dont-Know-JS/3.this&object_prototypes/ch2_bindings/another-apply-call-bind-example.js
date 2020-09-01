function negate(func) {
  return function() {
    return !func.apply(this, arguments); // uses apply, call or bind to execute the function against func argument
    // return !func.call(this);
    // return !(func.bind(this, ...arguments))();
    // return !func(); // still works...?

  }
}

function isNull(val) {
  return val === null;
}
const isNotNull = negate(isNull);

isNotNull(1); //?