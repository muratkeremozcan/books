// partition(): split one observable into two based on provided predicate
// partition(predicate: function: boolean, thisArg: any): [Observable, Observable]

import { from, merge, of } from 'rxjs';
import { partition, map, catchError  } from 'rxjs/operators';

const source1$ = from([1, 2, 3, 4, 5, 6]);


// Example 1: Split even and odd numbers

// first value is true, second false
const [evens, odds] = source1$.pipe(
  partition(val => val % 2 === 0)
);

merge(
  evens.pipe(
    map(val => `evens: ${val}`)
  ),
  odds.pipe(
    map(val => `odds: ${val}`)
  )
).subscribe(console.log);


// Example 2: Split success and errors

// if greater than 3, throw error

const successAndError$ = source1$.pipe(
  map(val => {
    if (val > 3) {
      throw `${val} greater than 3`;
    }
    return { success: val };
  }),
  catchError( val => of({ error: val }))
);

// split on success or error
// first item the truthy, second item the falsy
const [success, error] = successAndError$.pipe(
  partition(res => res.success)
);

merge(
  success.pipe(
    map(val  => `Success ${val.success}`)
  ),
  error.pipe(
    map(val => `Error ${val.error}`)
  )
).subscribe(console.log);

