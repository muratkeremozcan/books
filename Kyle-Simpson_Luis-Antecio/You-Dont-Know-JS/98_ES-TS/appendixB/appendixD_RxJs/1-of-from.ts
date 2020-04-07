// An observable is a function (or object) that gets the producer data and pushes it to the subscriber(s). 
// An observer is an object (or function) that knows how to handle data elements pushed by the observable

// observable : someObservable 
// observer : myObserver. 
// let mySubscription: Subscription = someObservable.subscribe(myObserver);
// To cancel the subscription, invoke the unsubscribe() method:
// mySubscription.unsubscribe();

// How can an observable communicate with the provided observer? By invoking the following functions on the observer object:
//  next(), to push the next data element to the observer
//  error(), to push the error message to the observer
//  complete(), to send a signal to the observer about the end of a stream

//  of(1,2,3) — Turns the sequence of numbers into an Observable
//  Observable.create(myObserver) — creates an Observable that can invoke methods on myObserver that you’ll create and supply as an argument
//  from(myArray) — Converts an array represented by the myArray variable into an Observable. 
// You can also use any iterable data collection or a generator function as an argument of from().
//  fromEvent(myInput, ‘keyup’) — Converts the keyup event from an HTML element represented by myInput into an Observable. 
//  interval(1000) — Emits a sequential integer (0,1,2,3..) every second

import { of, from } from 'rxjs';

// someObservable.subscribe(myObserver);
of(1, 2, 3).subscribe(
  value => console.log(value),
  err => console.error(err),
  () => console.log("Streaming is over")
);


from([4, 5, 6]).subscribe(
  value => console.log(value),
  err => console.error(err),
  () => console.log("Streaming is over")
);
