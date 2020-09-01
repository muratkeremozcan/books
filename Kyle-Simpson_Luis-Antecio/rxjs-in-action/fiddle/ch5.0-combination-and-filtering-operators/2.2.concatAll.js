import { map, take, concat, concat, delay } from 'rxjs/operators';
import { of, interval } from 'rxjs';

// concat(): Collect observables and subscribe to next when previous completes
// contrast to concat(): with concat, the latest observable is subscribed to

const source1$ = interval(1000).pipe(take(2));

const source2$ = source1$.pipe(
  map(val => of(val + 10)), // add 10 to and return as observable
  concat() // merge values from inner observable
)

source2$.subscribe(val =>
  console.log('Example with Basic Observable:', val)
);

//// with promise (very similar)

const sourcePromise$ = val => new Promise(resolve => resolve(val));

const source3$ = source1$.pipe(
  delay(2000),
  map(val => sourcePromise$(val)),
  concat()
);

source3$.subscribe(val => {
  console.log('Example with Promise:', val)
});


////  Delay while inner observables complete. Useful case of sequence. 
// Real life use case: progress bar https://www.learnrxjs.io/learn-rxjs/recipes/progressbar

const obs1 = interval(1000).pipe(take(5));
const obs2 = interval(500).pipe(take(2));
const obs3 = interval(2000).pipe(take(1));

const sourceCombined$ = of(obs1, obs2, obs3).pipe(
  delay(5000),
  concat()
);

/*
  output: 0,1,2,3,4,0,1,0
  How it works...
  Subscribes to each inner observable and emits values, when complete subscribe to next
  obs1: 0,1,2,3,4 (complete)
  obs2: 0,1 (complete)
  obs3: 0 (complete)
*/

sourceCombined$.subscribe(val => {
  console.log('Combined observable:', val);
})