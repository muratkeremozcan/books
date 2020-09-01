import * as Rx from 'rxjs/Rx';

// startWith() operator is a concat(Rx.Observable..(..)) in reverse; injects events before others are received.


Rx.Observable.range(5, 5)
  .startWith(3)
  .merge(Rx.Observable.of(20))
  .concat(Rx.Observable.of(33))
  .subscribe(console.log)