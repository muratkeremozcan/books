// you can use from to wrap a Promise with an Observable. Usage is similar to .of, .from, or .range

import * as Rx from 'rxjs/Rx';

// note: from() replaces fromPromise with its capability to resolve promises
// if not using Rx.Observable object and importing the function, there is no fromPromise - only from
// you could resolve all fromPromise calls with from in this file

/** promise that resolve to 42 in 2 seconds */
const fortyTwo = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(42);
  }, 2000)
});
// fortyTwo; //?
// outputs it without 'then..'
// fortyTwo.then(val => val) //? 

const increment = x => ++x;

Rx.Observable.from(fortyTwo)
  .map(increment)
  .subscribe(console.log) // 43
  // .subscribe(val => { // same thing
  //   console.log(val);
  // })

// subscribe takes as arguments the consumer function, and the optional error and complete functions
Rx.Observable.from(fortyTwo)
  .map(increment) // 43
  .map(increment) // 44
  .map(increment) // 45
  .subscribe(
    val => console.log(val),
    err => console.error(err),
    () => console.log('all done')
  );


// RxJS not only takes care of error handling for you (without messy, imperative try/catch statements) 
// but also provides logic that ties in with Promise semantics of resolve/reject.

/** outputs an error in 5 seconds, showcases built-in error handling in RxJs */
const errorFutureValue = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('error in 5 seconds'));
  }, 5000)
});

Rx.Observable.from(errorFutureValue)
  .subscribe(
    val => console.log(val),
    err => console.error(err),
    () => console.log('all done')
  );