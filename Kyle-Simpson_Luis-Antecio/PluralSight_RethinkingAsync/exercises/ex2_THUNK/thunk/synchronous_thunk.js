function add(x, y) {
  return (x + y);
}

// thunk has no arguments, it wraps a state and that state gives a value
var thunk = function() {
  return add(10, 15);
};

thunk(); //?
thunk(); //?
thunk(); //?