import { map, take, concatAll, concat, delay } from 'rxjs/operators';
import { of, interval } from 'rxjs';

// concatAll(): Collect observables and subscribe to next when previous completes
// contrast to concat(): with concatAll, the latest observable is subscribed to

const source1$ = interval(1000).pipe(take(2));

const source2$ = source1$.pipe(
  map(val => of(val + 10)), // add 10 to and return as observable
  concatAll() // merge values from inner observable
)

source2$.subscribe(val =>
  console.log('Example with Basic Observable:', val)
);

//// with promise (very similar)

const sourcePromise$ = val => new Promise(resolve => resolve(val));

const source3$ = source1$.pipe(
  delay(2000),
  map(val => sourcePromise$(val)),
  concatAll()
);

source3$.subscribe(val =>{
  console.log('Example with Promise:', val)
});


////

const obs1 = interval(1000).pipe(take(5));
const obs2 = interval(500).pipe(take(2));
const obs3 = interval(2000).pipe(take(1));

const sourceCombined$ = of(obs1, obs2, obs3).pipe(delay(3000));

sourceCombined$.subscribe(val => {
  console.log('Combined observable:', val);
})