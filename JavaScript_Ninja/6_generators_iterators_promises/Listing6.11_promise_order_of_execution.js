var assert = require('assert');

console.log("At code start");

var ninjaDelayedPromise = new Promise( (resolve, reject) => { // new Promise constructor and executor function with resolve and reject arguments
  console.log('ninjaDelayedPromise executor');
  setTimeout( () => { // promise set to resolve when timeout expires
    console.log('Resolving NinjaDelayedPromise');
    resolve('Hattori');
  }, 5000);
});
ninjaDelayedPromise.then( ninja => { // success callback called if we resolved successfully
  assert(ninja === 'Hattori');
  console.log(ninja);
});

const ninjaImmediatePromise = new Promise ( (resolve, reject) => {  // promise constructor with EXECUTOR and executor function with resolve and reject arguments
  console.log('ninjaImmediatePromise executor, immediate resolve');
  resolve('Yoshi'); // promise immediately resolved
});
// we use the promise by calling the built-in THEN method, to which we pass 2 callback functions : a SUCCESS callback and a FAILURE callback
// the THEN method is used to register a callback that will be executed when the promise successfully resolves and another callback to be executed when the promise fails
// IMPORTANT: the THEN callbacks (success or failure) are executed after all the code in the event loop is executed
ninjaImmediatePromise.then ( ninja => { // SUCCESS CALLBACK, called if resolved successfully
  console.log(ninja);
}, err => { // FAILURE CALLBACK, if error
  console.log(err);
});