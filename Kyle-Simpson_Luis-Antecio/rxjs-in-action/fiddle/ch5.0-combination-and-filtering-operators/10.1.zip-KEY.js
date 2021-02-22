import { delay } from 'rxjs/operators';
import { of, zip, combineLatest, forkJoin } from 'rxjs';

// zip(): after all observables emit, emit values as an array

const sourceOne$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9);
const sourceTwo$ = of('a', 'b', 'c', 'd', 'e');


const streamZip = zip(
  sourceOne$.pipe(delay(2000)),
  sourceTwo$.pipe(delay(1000))
);

streamZip.subscribe(
  v => console.log(v),
  null,
  () => console.log('zip() complete')
);


// // combineLatest() comparison: zip() gets equal number of elements, combineLatest gets everything
// const streamCombineLatest = combineLatest(
//   sourceOne$.pipe(delay(2000)),
//   sourceTwo$.pipe(delay(1000))
// );

// streamCombineLatest.subscribe(
//   v => console.log(v),
//   null,
//   () => console.log('combineLatest() complete')
// );


// // forkJoin() comparison: forkJoin() only gets the latest
// const streamForkJoin = forkJoin(
//   sourceOne$.pipe(delay(2000)),
//   sourceTwo$.pipe(delay(1000))
// );

// streamForkJoin.subscribe(
//   v => console.log(v),
//   null,
//   () => console.log('forkJoin() complete')
// );
