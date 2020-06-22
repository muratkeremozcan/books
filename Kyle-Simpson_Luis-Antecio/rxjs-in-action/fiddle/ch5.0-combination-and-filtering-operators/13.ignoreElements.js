import { interval, throwError, of } from 'rxjs';
import { mergeMap, ignoreElements, take } from 'rxjs/operators';

// ignoreElements(): ignore everything but complete and error.
// signature: ignoreElements(): Observable

const source = interval(100);
// ignore everything but complete
const example = source.pipe(take(5), ignoreElements());
// output: "COMPLETE!"
example.subscribe(
  val => console.log(`NEXT: ${val}`),
  val => console.log(`ERROR: ${val}`),
  () => console.log('COMPLETE!')
);


/// another example

// ignores everything but error
const error = source.pipe(
  mergeMap( val => {
    if (val === 4) {
      return throwError(`ERROR at ${val}`)
    }
    return of(val);
  }),
  ignoreElements() // ignores 0, 1, 2, 3
);

error.subscribe(
  val => console.log(`NEXT: ${val}`),
  val => console.log(`ERROR: ${val}`),
  () => console.log('COMPLETE!')
);
