import { interval, from } from 'rxjs';
import { skip, filter, take, delay, skipUntil } from 'rxjs/operators';

// Skip the provided number of emitted values
// signature: skip(the: Number): Observable
// enerally skip is used when you have an observable that always emits certain values on subscription that you wish to ignore.

const sourceInterval$ = interval(1000);

const skipFive$ = sourceInterval$.pipe(skip(5), take(5));

// output: 5...6...7...8........
skipFive$.subscribe(
  val => console.log('taking interval ', val),
  null,
  () => console.log('interval one complete')
);


/////////
const numArray$ = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


const skipTwo$ = numArray$.pipe(skip(2), delay(12000));

const filterAlternative$ = numArray$.pipe(
  filter((val, index) => index > 1), // remember: 1st arg to filter is the value(s) being passed in, second argument is the index
  delay(14000)
);

skipTwo$.subscribe(
  val => console.log('skipping first 2 ', val),
  null,
  () => console.log('skip complete')
);

filterAlternative$.subscribe(
  val => console.log('skipping first 2 with filter', val),
  null,
  () => console.log('filter complete')
);