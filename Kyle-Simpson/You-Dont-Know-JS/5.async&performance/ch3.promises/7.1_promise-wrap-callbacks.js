// challenge: converting callback based code to Promises
// While ES6 Promises don’t natively ship with helpers for such promisory wrapping, most libraries provide them, 
  // or you can make your own.

// Promise-aware wrapper for every callback-based utility
// produces a function that will produce Promises: promisory


if (!Promise.wrap) {
  Promise.wrap = function (fn) {
    return function () {
      var args = [].slice.call(arguments);

      return new Promise(function (resolve, reject) {
        fn.apply(
          null,
          args.concat(function (err, v) {
            if (err) {
              reject(err);
            }
            else {
              resolve(v);
            }
          })
        );
      });
    };
  };
}

// how to use it

// make a promisory for `ajax(..)`
var request = Promise.wrap(ajax);

// refactor `foo(..)`, but keep it externally callback-based for compatibility with other parts of the code 
// for now--only use `request(..)`'s promise internally.

function foo(x, y, cb) {
  request(
    "http://some.url.1/?x=" + x + "&y=" + y
  )
    .then(
      function fulfilled(text) {
        cb(null, text);
      },
      cb
    );
}

// now, for this code's purposes, make a promisory for `foo(..)`
var betterFoo = Promise.wrap(foo);

// and use the promisory
betterFoo(11, 31)
  .then(
    function fulfilled(text) {
      console.log(text);
    },
    function rejected(err) {
      console.error(err);
    }
  );
