import { of, from } from 'rxjs';
import { sequenceEqual, switchMap } from 'rxjs/operators';


// Compares emitted sequence to expected sequence for match. Great for testing
// signature: sequenceEqual(compareTo: Observable, comparor?: (a, b) => boolean): Observable

const expectedSequence = from([4,5,6]);

of([1,2,3], [4,5,6], [7,8,9]).pipe(
  switchMap(arr => from(arr).pipe(
    sequenceEqual(expectedSequence)
  ))
).subscribe(console.log);


// check out keyboard events, lockscreen, memory game
// https://www.learnrxjs.io/learn-rxjs/operators/conditional/sequenceequal