export default function run(gen) {
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
