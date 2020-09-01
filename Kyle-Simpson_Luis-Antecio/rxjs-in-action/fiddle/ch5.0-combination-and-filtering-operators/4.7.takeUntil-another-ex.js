import { interval } from 'rxjs/observable/interval';
import { takeUntil, filter, scan, map, withLatestFrom } from 'rxjs/operators';

// takeUntil(): emit values until provided observable emits.
// signature: takeUntil(notifier: Observable): Observable
// 💡 If you only need a specific number of values, try take!


// Take the first 5 even numbers

const source = interval(1000);
const isEven = val => val % 2 === 0;
const evenSource$ = source.pipe(filter(isEven));
// keep a running total of the number of even numbers out
const evenNumberCount$ = evenSource$.pipe(scan((acc, _) => acc + 1, 0));
// do not emit until 5 even numbers have been emitted
const fiveEvenNumbers$ = evenNumberCount$.pipe(filter(val => val > 5));

const example1 = evenSource$.pipe(
  withLatestFrom(evenNumberCount$), // also give me the current even number count for display
  map(([val, count]) => `Even number count:(${count}) , value: ${val}`),
  takeUntil(fiveEvenNumbers$) // when five even numbers have been emitted, complete source observable
)
example1.subscribe(console.log);


// Take mouse events on mouse down until mouse up
// https://stackblitz.com/edit/rxjs-ug2ezf?file=index.ts&devtoolsheight=50