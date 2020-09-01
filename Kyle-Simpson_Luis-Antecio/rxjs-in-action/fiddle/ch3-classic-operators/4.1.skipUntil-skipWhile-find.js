import { interval, timer } from 'rxjs';
import { skipUntil, skipWhile, find } from 'rxjs/operators';

// skipUntil(): skip emitted values from source until provided observable emits.
// signature: skipUntil(the: Observable): Observable
// do not intermix with skip. Use delay() when needed

// emit every 1s
const source1$ = interval(1000);
// skip emitted values from source until inner observable emits (6s)
const skipUntilExample$ = source1$.pipe(skipUntil(timer(6000)));
// output: 5...6...7...8........
skipUntilExample$.subscribe(
  val => {
  console.log(`skipUntil ${val}`)
  },
  null,
  () => console.log('complete')
);



// skipWhile(): skip emitted values from source until provided expression is false.
// signature: skipWhile(predicate: Function): Observable

const skipWhileExample$ = source1$.pipe(skipWhile(val => val < 15));

skipWhileExample$.subscribe(
  val => console.log(`skipWhile ${val}`),
  null,
  () => console.log('complete')
);



//////

// find(): emit the first item that passes predicate then complete.
// signature: find(predicate: function)
// 💡 If you always want the first item emitted, regardless of condition, try first()!

const findExample$ = source1$.pipe(find(val => val === 2));

findExample$.subscribe(
  val => console.log(`found: ${val}`),
  null,
  () => console.log('find complete')
);

// complex example
// https://www.learnrxjs.io/learn-rxjs/operators/filtering/find