import { from } from 'rxjs';
import { first, find, last } from 'rxjs/operators';

// first(): emit the first value or first to pass provided expression.
// signature: first(predicate: function, select: function)

// 💡 The counterpart to first is last!
// 💡 First will deliver an EmptyError to the Observer's error callback if the Observable completes before any next notification was sent.
//  If you don't want this behavior, use take(1) instead.


// toggle first vs last to see the difference


const source1$ = from([1, 2, 3, 4, 5, 4, 4, 3, 3]);

const getFirstOrLast$ = source1$.pipe(
  first()
  // last()
);

getFirstOrLast$.subscribe(
  val => console.log(`first or last value is: ${val}`),
  null,
  () => console.log('getFirstOrLast$ complete')
)


// example: first value to pass predicate. Kind of like find() here

const getFirstOrLastPredicate$ = source1$.pipe(
  // first(num => num === 7, 'you can utilize default value as the 2nd arg, if nothing is found')
  // find(num => num === 5) // you could replace it with find here. The distinction is find does not have a default value
  last(num => num === 7, 'you can utilize default value as the 2nd arg, if nothing is found')
)

getFirstOrLastPredicate$.subscribe(
  val => console.log(`first or last predicate is: ${val}`),
  null,
  () => console.log('getFirstOrLastPredicate$ complete')
)
