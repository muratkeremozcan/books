// switchMap(): map to observable, complete previous inner observable, emit values.
// signature: switchMap(project: function: Observable, resultSelector: function(outerValue, innerValue, outerIndex, innerIndex): any): Observable

// 💡 If you would like more than one inner subscription to be maintained, try mergeMap!
// 💡 This operator is generally considered a safer default to mergeMap!
// 💡 This operator can cancel in-flight network requests!
// The main difference between switchMap and other flattening operators is the cancelling effect.

// typeaheads are a good example
// Be careful though, you probably want to avoid switchMap in scenarios where every request needs to complete, think writes to a database. 
// switchMap could cancel a request if the source emits quickly enough. In these scenarios mergeMap is the correct option.


// 2 DOM examples https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap

import { timer, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';


// switch to new inner observable when source emits, emit result of project function

timer(0, 5000).pipe(
  switchMap(
    () => interval(2000),
    // remember the 2nd argument; the result selector function
    (outerValue, innerValue, outerIndex, innerIndex) => ({
      outerValue,
      innerValue,
      outerIndex,
      innerIndex
    })
  )
).subscribe(console.log);



// switchMapTo(): map to same inner observable, complete previous inner observable.
// signature: switchMapTo(innerObservable: Observable, resultSelector: function(outerValue, innerValue, outerIndex, innerIndex): any): Observable
// 💡 If you need to consider the emitted value from the source, try switchMap!

https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmapto