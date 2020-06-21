import { take, map, mergeMap, combineAll } from 'rxjs/operators';
import { interval } from 'rxjs';

// combineAll() : When source observable completes use combineLatest with collected observables

const source1$ = interval(1000).pipe(take(2));

// map each emitted value from source to interval observable that takes 5 values
const source2$ = source1$.pipe(
  map(val =>
    interval(1000).pipe(
      map(i => `Result (${val}): ${i}`),
      take(5)
    )
  )
);

/*
  2 values from source will map to 2 (inner) interval observables that emit every 1s.
  combineAll uses combineLatest strategy, emitting the last value from each whenever either observable emits a value
*/

source2$.pipe(combineAll()).subscribe(console.log);