import { timer, combineLatest } from 'rxjs'
import { map, take } from 'rxjs/operators';

// combineLatest(source_1, ... source_n)

// at time t, return the latest combination in an array
// if both have emitted at time t, return again to get the latest value change 

// The business case is when you are interested in the very latest from each source
// and past values are of less interest

let start = new Date();

const source1$ = timer(0, 100)
  .pipe(
    map(val => `source1$: ${val}`),
    take(6)
  );

const source2$ = timer(0, 50)
  .pipe(
    map(val => ` source2$: ${val}`),
    take(5)
  );

const stream$ = combineLatest(source1$, source2$);

stream$.subscribe(
  x => console.log(`${new Date() - start}ms : values [${x}] `)
  ,
  null,
  () => console.log('complete')
);
