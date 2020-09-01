import * as Rx from 'rxjs/Rx';

// switch: useful when a stream is used to initiate another stream
// each time the source observable emits, switch() immediately unsubscribes from it and begins emitting events from the latest observable that was mapped.
// in other words, it cancels the first sequence when a new one starts emitting


Rx.Observable.of(42)  // when this event occurs...
  .map(forty2 => Rx.Observable.range(1, 3)) // ...it's cancelled and replaced by this event
  .switch()
  .subscribe(console.log)

/*
  Rx.Observable.fromEvent(document, 'click') // listen for clicks
    .map(click => Rx.Observable.range(1, 2, 3)) // maps another observable to the source observable
    .switch() // use switch to begin emitting data from projected observable
    .subscribe(console.log)  // prints 1, 2, 3 to the console after the mouse is clicked

  // merge comparison: here the click events is not cancelled, observers will see clicks mixed with 1-3 range
  Rx.Observable.fromEvent(document, 'click')
    .merge(Rx.Observable.range(1, 3))
    .subscribe(console.log)
*/