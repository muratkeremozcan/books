function foo(x, y, cb) {
  setTimeout(function() {
    cb (x + y);
  }, 1000);
}


// We can essentially extend the narrow thunk definition to include it receiving a callback.
// the thunk just waits around for the callback to resolve
function fooThunk(cb) {
  foo(3, 4, cb);
}

fooThunk(function(sum) {
  sum; //?
});