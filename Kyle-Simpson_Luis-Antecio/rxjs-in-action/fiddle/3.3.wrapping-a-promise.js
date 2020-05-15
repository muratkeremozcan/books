import Rx from 'rxjs/Rx';

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

// there is an incompatibility and the observer.subscribe() doesn't even run
// Promises are unbreakable!
// subscription$.unsubscribe();
// Most of the time, though, you don’t have to worry about cancelling subscriptions yourself because many RxJS operators do this for you.


