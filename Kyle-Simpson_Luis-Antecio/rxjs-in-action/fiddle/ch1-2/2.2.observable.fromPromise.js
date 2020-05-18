// you can use fromPromise to wrap a Promise with an Observable. Usage is similar to .of, .from, or .range

import Rx from 'rxjs/Rx';

const fortyTwo = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(42);
  }, 2000)
});
fortyTwo; //?

const increment = x => ++x;

Rx.Observable.fromPromise(fortyTwo)
  .map(increment)
  .subscribe(console.log) // 43
  // .subscribe(val => { // same thing
  //   console.log(val);
  // })

Rx.Observable.fromPromise(fortyTwo)
  .subscribe(
    val => console.log(val),
    err => console.error(err),
    () => console.log('all done')
  );

// RxJS not only takes care of error handling for you (without messy, imperative try/catch statements) 
// but also provides logic that ties in with Promise semantics of resolve/reject.

const errorFutureValue = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('some error'));
  }, 5000)
});

Rx.Observable.fromPromise(errorFutureValue)
  .subscribe(
    val => console.log(val),
    err => console.error(err),
    () => console.log('all done')
  );