import * as Rx from 'rxjs/Rx'

// Cold is unicast
// Hot is multicast
// ex: Promises are hot because the value they emit is shared almong all subscribers and are not repeatable or retryable

// ideally you want cold observables that are replayable. How do you get them from hot to cold?

const futureVal = new Promise((resolve, reject) => {  
  setTimeout(() => {
     resolve(42);
  }, 2000);
});

const promise$ = Rx.Observable.fromPromise(futureVal);

// begins invoking the promise
promise$.subscribe(console.log);
// after the first invocation of the Promise resolves, all subsequent subscriptions will resolve to the same value.
promise$.subscribe(console.log);


// KEY: to make a HOT/multi-cast observable COLD/uni-cast, move the source or the producer of events into the observable context:

// until now we used this format with Rx.Observable.create(observer => {..})
const coldPromise$ = new Rx.Observable(observer => {
  // Shoves the instantiation of the Promise into the observable
  const futureVal = new Promise((resolve, reject) => {  
    setTimeout(() => {
       resolve(52);
    }, 5000);
  });

  futureVal.then(result => {
    observer.next(result); // emit the value from the promise
    observer.complete(); // a single value is expected, so complete the stream
  });
});

// both subscribers independently invoke the internal promise object
coldPromise$.subscribe(console.log);    
coldPromise$.subscribe(console.log);    