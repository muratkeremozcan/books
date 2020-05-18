import Rx from 'rxjs/Rx';

/** counts up indefinitely */
const timer$ = Rx.Observable.create(observer => {
  let i = 0;
  let timer = setInterval(() => {
    observer.next(i++);
  }, 1000);

  // The function at the end of an observable is needed for the observer to be able to unsubscribe
  // It is analogous to finally in try catch.
  // It becomes the body of the unsubscribe() method and executes when the unsubscribe method is called. 
  return () => {
    clearInterval(timer)
  }
});

// thanks to lazy evaluation, the observable is dormant until subscription
// in contrast, eager evaluation would want to calculate time to infinity first, then execute
const sub = timer$.subscribe(console.log); 

// observer.unsubscribe() Tears down the stream and frees up any allocated objects
// it also takes care of memory de-allocation for you
setTimeout(() => {
  sub.unsubscribe();
}, 10000);