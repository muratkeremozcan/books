const Rx = require('rxjs/Rx');

// Observables are a push based mechanism; the Observer does not know when the data will be available (mouse click etc.)
// Iterators (generators) are a pull based mechanism; for cases where you know a value can be immediately returned from a computation

// An observable behaves like a function that begins chipping away at the data pushed into it as soon as a subscriber is available; 
// the subscriber has the key to turn the stream off via sub.unsubscribe().

// producer / Observable is lifted into the stream context with Rx.Observable.of(..) .from or .range
// as an alternative, you can use Rx.Observable.create(), but with this approach you need to use a function
// that takes an observer object, which you can use to signal the next emitted event by invoking its next() method.
const source$ = Rx.Observable.create(observer => {
  observer.next('4111111111111111');
  observer.next('5105105105105100');
  observer.next('4342561111111118');    
  observer.next('6500000000000002');    
  observer.complete(); // if an observable is finite, you can signal its completion with complete() . There is also an optional error method                 
}); // at this point the observable is idle

const subscription = source$.subscribe(console.log); // with subscribe, the observer logic is executed


// another example of Observable.create
/** every second, counts up */
const sourceTimer$ = Rx.Observable.create(observer => {
  let i = 0;
  setInterval(() => {
    observer.next(i++);
  }, 1000);
});

// thanks to lazy evaluation, the observable is dormant until subscription
// in contrast, eager evaluation would want to calculate time to infinity first, then execute
const sub = sourceTimer$.subscribe(console.log); //?
