// you don't want to make thunks manually
// this is a utility that does the thunk wrapping

function foo(x, y, cb) {
  setTimeout(function () {
    cb(x + y);
  }, 1000);
}

function thunkify(fn) {
  return function () {
    var args = [].slice.call(arguments);
    return function (cb) {
      args.push(cb);
      return fn.apply(null, args);
    };
  };
}

// it’s quite useful to make thunkories at the beginning of your program to wrap existing API methods, 
var fooThunkory = thunkify(foo);

// and then be able to pass around and call those thunkories when you need thunks
var fooThunk1 = fooThunkory(3, 4);
var fooThunk2 = fooThunkory(5, 6);

// later
fooThunk1(function (sum) {
  console.log(sum);     // 7
});

fooThunk2(function (sum) {
  console.log(sum);     // 11
});


// Promises and thunks both can be seen as a request for a value, which may be async in its answering.
