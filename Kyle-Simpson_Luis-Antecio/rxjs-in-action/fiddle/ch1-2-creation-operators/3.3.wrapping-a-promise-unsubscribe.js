import * as Rx from 'rxjs/Rx';

// showcasing that we cannot cancel a promise / unsubscribe from it
// note that most of the time, you don’t have to worry about cancelling subscriptions yourself because many RxJS operators do this for you.

// Promises lack the ability to generate more than one value, ability to retry

// simple promise that returns 42 after 5 seconds
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(42);
  }, 5000);
});
// promise.then(val => val); //?

// create an observable wrapping a promise
const promiseObservable$ = Rx.Observable.fromPromise(promise);

const subscription$ = promiseObservable$.subscribe(
  val => {
    console.log(`in subscribe(): ${val}`);
  });

// cannot unsubscribe (NOTHING RUNS); there is an incompatibility and the observer.unsubscribe() doesn't even run
// Promises are unbreakable!

subscription$.unsubscribe();
