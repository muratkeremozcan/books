import { from } from 'rxjs';
import { single } from 'rxjs/operators';

// single(): emit single item that passes expression
// signature: single(a: Function): Observable

const source1$ = from([1, 2, 3, 4, 5, 4, 4, 3, 3]);

const getSingle$ = source1$.pipe(
  single(val => val === 5) // if you check for an element that has a duplicete, it will complain that there multiple results
);

getSingle$.subscribe(
  val => console.log(`single value is: ${val}`),
  null,
  () => console.log('single$ complete')
)