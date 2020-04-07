import {Subject} from 'rxjs';
import 'rxjs/Rx';

// Observables are a reactive, evented, array-like data structures that act like a stream of values
// It assumes that values will come one at a time over time
// Imagine it more like a buffer than an array because we do not need to keep values in it once they have been handled
// If an array is an eager data structure for FP operations, an Observable is its lazy-over-time counterpart.


// In the RxJS universe, an Observer subscribes to an Observable. 
// If you combine the functionality of an Observer and an Observable, you get a Subject.

// to keep it simple, here a is a Subject, so that it can be on both sides
var a = new Subject();

// Producer (a as Observable)
setInterval(function everySecond() {
  a.next(Math.random());
}, 2000);


// Consumer (a as Observer)
var b = a.map(function double(v) {
  return v * 2;
});
b.subscribe(function onValue(v) {
  console.log(v);
})