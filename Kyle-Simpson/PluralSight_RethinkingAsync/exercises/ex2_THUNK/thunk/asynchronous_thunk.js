function addAsync(x, y, cb) {
  setTimeout(function() {
    cb(x + y);
  }, 1000);
}
// thunk has no arguments, it wraps a state and that state/value gives a value
// async thunk has a callback as its argument, wraps a state/value, that state gives a value, the value uses the callback. Eliminates time as a factor - we get it when it's ready

// function expression
var thunk = function(cb) {
  addAsync(10, 15, cb);
};

// function declaration
// function thunk(cb) {
//     addAsync(10, 15, cb);
// }

thunk(function(bleh){ // every time we call thunk and pass in a callback, we will get a value out
  bleh;
});
thunk(function(sum){ // we don't know or care how and when the value will be available
  sum;
});
