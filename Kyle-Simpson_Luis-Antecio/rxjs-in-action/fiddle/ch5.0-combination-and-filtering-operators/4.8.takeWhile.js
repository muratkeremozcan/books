import { of } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';

// takeWhile(): emit values until provided expression is false.
// signature: takeWhile(predicate: function(value, index): boolean, inclusive?: boolean): Observable
// 💡 When the optional inclusive parameter is set to true it will also emit the first item that didn't pass the predicate.

const source1$ = of(1, 2, 3, 4, 5);

// allow values until value from source is greater than 4, then complete
source1$.pipe(
  takeWhile(val => val <= 3, false) // switch to true to output the first item that failed the check
).subscribe(console.log)


// Difference between takeWhile and filter: filter will evaluate the whole source, takeWHile will stop with the first condition being false

const source$ = of(3, 3, 3, 9, 1, 4, 5, 8, 96, 3, 66, 3, 3, 3);

// allow values until value from source equals 3, then complete
source$.pipe(
  takeWhile(val => val === 3)
).subscribe(val => console.log('takeWhile', val));

source$.pipe(
  filter(val => val === 3)
).subscribe(val => console.log('filter', val));