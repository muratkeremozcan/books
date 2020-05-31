import Rx from 'rxjs/Rx';

// every observable also has a set of events, or hooks, in its lifecycle that can be plugged into
// startWith() operator is a concat(Rx.Observable..(..)) in reverse; injects events before others are received.


Rx.Observable.range(5, 5)
  .startWith(3)
  .concat(Rx.Observable.of(33))
  .subscribe(console.log)