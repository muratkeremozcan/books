// promises use the split-callback style; there’s one callback for fulfillment and one for rejection:

var p = Promise.reject('oops');

p.then(
  function fulfilled() {

  },
  function rejected(err) {
    console.log(err);
  }
);

////////////

// what if you have errors like these? no lowercase for numbers
var pr = Promise.resolve(42);

pr.then(
  function fulfilled(msg) {
    // numbers don't have string functions,
    // so will throw an error  (UNLESS YOU CATCH LATER LIKE BELOW)
    console.log(msg.toLowerCase());
  },
  function rejected(err) {
    // never gets here. Our promise rejection does not get triggered!
    // this is because this error handler is for the Promise, which resolves without issues
  }
) // some suggest to end it with catch, so that errors propagate down here
  .catch(
    function (err) {
      // error propagated
      console.log(err)
      // but what if there is an error here too? endless catches? Waiting for a better solution in ES7
    }
  );
