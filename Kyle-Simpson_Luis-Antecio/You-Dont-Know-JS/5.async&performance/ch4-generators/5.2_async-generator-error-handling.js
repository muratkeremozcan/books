// error handling at the iterator
function *main_simple() {
  var x = yield "Hello World";
  x; //?
  yield x.toLowerCase();  // cause an exception!
}

var itr = main_simple(); //?
var val = itr.next().value; //?

// itr.next(); // toggle
// instead program failing and getting blocked by error
// use try catch!
try {
  // toggle to simulate one of the 3 outcomes
  itr.next(); // causes an exception at the generator, that gets error handled in the iterator
  // itr.throw('oops'); // causes the error in the iterator with .throw. Still handled in the iterator
  // itr.next(val); // passes a valid value, no errors
}
catch (er) {
  console.log(er);
}

///////
// error handling at the generator
// We can even catch the same error that we throw(..) into the generator, 
// essentially giving the generator a chance to handle it but if it doesn’t, the iterator code must handle it:

function *main(){
  // (2) generator main handles the error if it has error handling. Otherwise the iterator handles it if it has error handling
  // toggle off to simulate err handling in the iterator

  try { // toggle
    var x = yield "Hello World";
    console.log(x);
  } // toggle
  catch (e) { // toggle
    console.log(e); // toggle
  } // toggle
} // toggle

var it = main();
it.next(); //?

try {
  // (1) who handles this error at the iterator?
  it.throw('oops');
  // it.next('hey'); // no error case 
}
catch (err) {
  // if generator main does not have error handling (toggle it off to see), then instead the iterator code handles the error
  console.log(err);
}