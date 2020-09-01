import {Observable} from 'rxjs';
import 'rxjs/Rx';

// if we want to keep the Observer and Observable separate, we can do the below

// Producer
// a is the Observable, argument observer is the Observer
// the observer is able to observe events like setInterval
// we use its next() method to feed events into the observable stream
var a = Observable.create(function onObserve(observer) {
  setInterval (function everySecond() {
    observer.next(Math.random());
  }, 1000);
});


// Consumer
var b = a.map(function double(v) {
  return v * 2;
});

b.subscribe(function onValue(v) {
  console.log(v);
});

// It’s not necessary to assign the observable to b and then call b.subscribe(..) separately from the chain; 
// that’s done here to reinforce that each operator returns a new observable from the previous one.
// In many coding examples you’ll find, the subscribe(..) call is just the final method in the chain. 
// Because subscribe(..) is technically mutating the internal state of the observable, 
// FPers generally prefer these two steps separated, to mark the side effect more obviously.
