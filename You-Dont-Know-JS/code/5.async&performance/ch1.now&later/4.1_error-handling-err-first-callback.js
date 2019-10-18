// classic callback pattern: error first callback style

function foo(cb) {
  setTimeout(function() {
    try{
      var x = baz.bar();
      cb(null, x);
    }
    catch(err) {
      cb(err);
    }
  },100);
}

foo(function(err,val) {
  // The callback we pass to foo(..) expects to receive a signal of an error by the reserved first parameter, err. 
  // If present, error is assumed. If not, success is assumed.

  if(err) {
    console.error(err);
  }
  else {
    console.log(val);
  }
})

// The try..catch here works only from the perspective that the baz.bar() call will either succeed or fail immediately,
// synchronously. If baz.bar() was itself its own async completing function, 
// any async errors inside it would not be catchable.
