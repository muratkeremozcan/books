// what if we wanted to Promise-drive a generator no matter how many steps it has? 
// We don’t want to manually write out the Promise chain differently for each generator

// this is a utility to repeat (aka loop over) the iteration control
// it advances the generator you pass to it, asynchronously until completion
// each time a Promise comes out, waits on its resolution before continuing, also takes care of error handling
// Replaces the iterator portion of 6.1

function generatorRunner(gen) {
  // slice method can be called to convert Array-like objects / collections to a new Array.
  var args = [].slice.call( arguments, 1), it; //?

  // initialize the generator in the current context, with optional arguments
  it = gen.apply( this, args ); //?

  // return a promise for the generator completing
  return Promise.resolve()
    .then(function handleNext(value) {
      value; //?
      // run to the next yielded value
      var next = it.next(value); //? 

      // IIFE
      return (function handleResult(next) {
        // generator has completed running?
        if (next.done) {
          return next.value; 
        }
        // otherwise keep going
        else {
          return Promise.resolve(next.value)
            .then(
              // resume the async loop on success, 
              // sending the resolved value back into the generator
              handleNext,

              // if `value` is a rejected promise, 
              // propagate error back into the generator for its own
              // error handling
              function handleErr(err) {
                return Promise.resolve(
                  it.throw(err)
                )
                  .then(handleResult);
              }
            );
        }
      })(next);
    });
}


// example of usage

function foo(x, y) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x + y);
      }, Math.random() * 1000);

      setTimeout(function () {
        reject('rejector kicked in');
      }, 600);

    });
}

function* main() {
  try {
    var text = yield foo(11, 31);
    console.log(text);
  }
  catch (err) {
    console.log(err);
  }
}

generatorRunner(main);
// generatorRunner(main); 
// generatorRunner(main);