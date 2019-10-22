// generators are still functions: still accepts arguments and returns values

function *foo(x, y) {
  return x*y;
}

// key difference: the generator has not run yet, instead an iterator object has been created to control the foo*(..) generator
var itr = foo(6,7);

// .. then we call next() which instructs the foo*(..) generator to advance either to the next yield or end of the generator
// the result of the next() is an object with a value property. This value is whatever was yielded or the end of the generator
var res = itr.next(); //?
res.value; //?

