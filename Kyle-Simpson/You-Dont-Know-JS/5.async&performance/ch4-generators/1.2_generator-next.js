// generators are still functions: still accepts arguments and still returns values

function *foo(x, y) {
  return x*y;
}

var itr = foo(6,7);
// key difference: the generator has not run yet, instead an iterator object has been created to control the foo*(..) generator
itr; //?

// .. then we call next() which instructs the foo*(..) generator to advance either to the next yield or end of the generator
// the result of the next() is an object with a value property. This value is whatever was yielded or the return value at the end of the generator
// if nothing is returned by the generator (returning a value is not a requirement in functions), an undefined return value is assumed
var res = itr.next(); //?
res.value; //?

