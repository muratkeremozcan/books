
// mergeMap() / flatMap() : map to observable, emit values.
// signature: mergeMap(project: function: Observable, resultSelector: function: any, concurrent: number): Observable

// 💡 flatMap is an alias for mergeMap!
// 💡 If only one inner subscription should be active at a time, try switchMap!
// 💡 If the order of emission and subscription of inner observables is important, try concatMap!

// This operator is best used when you wish to flatten an inner observable but want to manually control the number of inner subscriptions.
// For instance, when using switchMap each inner subscription is completed when the source emits, allowing only one active inner subscription. 
// In contrast, mergeMap allows for multiple inner subscriptions to be active at a time.
//  Because of this, one of the most common use-case for mergeMap is requests that should not be canceled, think writes rather than reads. 
// Note that if order must be maintained concatMap is a better option.

// Be aware that because mergeMap maintains multiple active inner subscriptions at once, it's possible to create a memory leak through long-lived inner subscriptions.
// A basic example would be if you were mapping to an observable with an inner timer, or a stream of dom events. 
// In these cases, if you still wish to utilize mergeMap you may want to take advantage of another operator to manage the completion of the inner subscription, 
// think take or takeUntil. 

// check out 2 dom examples at https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergemap

import { of, from, interval } from 'rxjs';
import { mergeMap, map, flatMap, take } from 'rxjs/operators';


// example: flattening a promise

const myPromise = val => new Promise(
  resolve => resolve(`${val} World from Promise`)
)
const promise$ = val => from(myPromise(val)); // it is optional to convert to an observable

const source$ = of('Hello');

source$.pipe(
  mergeMap(val => promise$(val))
).subscribe(console.log);


// selecting between source and final merged value
source$.pipe(
  mergeMap(
    val => myPromise(val),
    // you can also supply a second argument (a result selector function) which receives the source value and emitted value of inner observable or promise
    (valueFromSource, valueFromPromise) => `Source: ${valueFromSource}, Promise: ${valueFromPromise}`
  )
).subscribe(console.log);



// example: mergeMap with concurrent value

const source2$ = interval(1000);

source2$.pipe(
  // project/transform to another observable
  mergeMap(
    val => interval(5000).pipe(
      take(2)
    ),
    // remember the 2nd argument; the result selector function
    (oVal, iVal, oIndex, iIndex) => [oIndex, oVal, iIndex, iVal],
  )
).subscribe(console.log);

/*
      Output:
      [0, 0, 0, 0] <--1st inner observable
      [1, 1, 0, 0] <--2nd inner observable
      [0, 0, 1, 1] <--1st inner observable
      [1, 1, 1, 1] <--2nd inner observable
      [2, 2, 0, 0] <--3rd inner observable
      [3, 3, 0, 0] <--4th inner observable
*/