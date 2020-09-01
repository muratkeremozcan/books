import { delay, take, mergeMap, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError, interval } from 'rxjs';

// Example 2: Observables completing after different durations

const myPromise = val => new Promise(resolve =>
  setTimeout(() => resolve(`Promise resolved: ${val}`), 5000)
);


// when all observables complete, give the last
// emitted value from each as an array

const stream = forkJoin(
  of('hello'), // emit immmediately
  of('world').pipe(delay(1000)), // emit after 1 sec
  interval(1000).pipe(take(1)), // emit 0..1 in 1 second interval
  interval(1000).pipe(take(2)),
  myPromise('RESULT') // promise that resolves after 5 secs
)

//output: ["Hello", "World", 0, 1, "Promise Resolved: RESULT"]
stream.subscribe(console.log);


// another ex: making variable number of requests
const source$ = of([1, 2, 3, 4, 5]);

// emit array of all 5 results
const stream2 = source$.pipe(
  mergeMap(q => forkJoin(
    ...q.map(myPromise))
  )
) 

stream2.subscribe(console.log);



/// error example: handling it on the outside

const errorStream = forkJoin(
  of('Hello'), // emit immediately
  of('World').pipe(delay(7000)), // emit after 7 secs
  throwError('This will error').pipe(catchError(error => of(error)))
) // catchError is the same as catch

errorStream.subscribe(console.log);


/// forkJoin angular example
// https://plnkr.co/edit/ElTrOg8NfR3WbbAfjBXQ?p=preview