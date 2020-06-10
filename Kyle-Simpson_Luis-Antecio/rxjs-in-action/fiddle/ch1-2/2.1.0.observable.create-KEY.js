const Rx = require('rxjs/Rx');

// Observables are a push based mechanism; the Observer does not know when the data will be available (mouse click etc.)

// An observable behaves like a function that begins chipping away at the data pushed into it as soon as a subscriber is available; 
// the subscriber has the key to turn the stream off via sub.unsubscribe().

// producer / Observable is lifted into the stream context with Rx.Observable.of(..) .from or .range
// as an alternative, you can use Rx.Observable.create()
// create() method takes a function with an input parameter observer.
// an observer is just an object with the following methods: next error complete

const source$ = Rx.Observable.create(observer => {
  observer.next('4111111111111111');
  observer.next('5105105105105100');
  observer.next('4342561111111118');    
  observer.next('6500000000000002');   
  // observer.error('error message'); // there is also an optional error method  
  observer.complete(); // if an observable is finite, you can signal its completion with complete() .               
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


import { Observable } from 'rxjs';

let stream$ = Observable.create((observer) => {
  observer.next(1)
});

stream$.subscribe((data) => {
  console.log('Data', data);
})