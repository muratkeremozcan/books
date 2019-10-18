var assert = require('assert');

const ninjaPromise = new Promise( (resolve, reject) => { // new Promise constructor to which we pass a EXECUTOR function with parameters resolve and reject
  resolve ("Hattori"); // we can call resolve to resolve successfully
  reject("an error resolving a promise"); // we call reject if an error occurs
});

// we use the promise by calling the built-in THEN method, to which we pass 2 callback functions : a SUCCESS callback and a FAILURE callback
// the THEN method is used to register a callback that will be executed when the promise successfully resolves and another callback to be executed when the promise fails
ninjaPromise.then( ninja => { // SUCCESS CALLBACK, called if resolved successfully
  console.log(ninja);
  assert(ninja === 'Hattori');
}, err => { // FAILURE CALLBACK, if error
  console.log('there was an error', err);
});
// PERK of PROMISES over CALLBACKs
// try catch statements
// easier error handling
// performing sequences of steps is easier