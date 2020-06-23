// exhaustMap(): map to inner observable, ignore other values until that observable completes.
// signature: exhaustMap(project: functi,on, resultSelector: function): Observable

import { interval, merge, of} from 'rxjs';
import { delay, take, exhaustMap, concatMap, switchMap, mergeMap, tap } from 'rxjs/operators';

const sourceInterval = interval(1000);
const delayedInterval = sourceInterval.pipe(delay(10), take(4));

merge(
  // delay 10ms, then start interval emitting 4 values
  delayedInterval,
  // emit immediately
  of(true)
)
  .pipe(exhaustMap(_ => sourceInterval.pipe(take(5))))
  /*
   *  The first emitted value (of(true)) will be mapped
   *  to an interval observable emitting 1 value every
   *  second, completing after 5.
   *  Because the emissions from the delayed interval
   *  fall while this observable is still active they will be ignored.
   *
   *  Contrast this with concatMap which would queue,
   *  mergeMap which would maintain a new subscription for each emitted value.
   *  switchMap which would switch to a new inner observable each emission,
   */
  // output: 0, 1, 2, 3, 4
  .subscribe(val => console.log(val));



// another ex

const firstInterval = interval(1000).pipe(take(10));
const secondInterval = interval(1000).pipe(take(2));

const exhaust$ = firstInterval.pipe(
  delay(10000),
  exhaustMap(f => {
    console.log(`Emission Corrected of first interval: ${f}`);
    return secondInterval;
  })
);

/*
  When we subscribed to the first interval, it starts to emit a values (starting 0).
  This value is mapped to the second interval which then begins to emit (starting 0).
  While the second interval is active, values from the first interval are ignored.
  We can see this when firstInterval emits number 3,6, and so on...

    Output:
    Emission of first interval: 0
    0
    1
    Emission of first interval: 3
    0
    1
    Emission of first interval: 6
    0
    1
    Emission of first interval: 9
    0
    1
*/
exhaust$.subscribe(console.log);



// mergeScan(): Accumulate value over time via merged observables. 
// signature: mergeScan(accumulator: (acc, value, index: number) => ObservableInput, seed, concurrent: number = Number.POSITIVE_INFINITY): OperatorFunction


// https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergescan