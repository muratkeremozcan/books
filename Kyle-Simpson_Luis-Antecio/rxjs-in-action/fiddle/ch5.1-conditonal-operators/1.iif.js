import { iif, of, interval } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

// instead of if else conditional, use the RxJS if operator: Rx.Observable.if(() => condition, then$, else$)
// iif if not using the Rx.Observable object
// if() operator (also called the functional combinator) select between two streams based on the condition
// another example in error handling, Ch 7

const r$ = of('R');
const x$ = of('X');

interval(1000).pipe(
  take(9),
  mergeMap(v => iif(
    () => v % 4 === 0,  // multiples of 4 should give R 
    r$,
    x$ // if there is no else specified, defaults to EMPTY. Toggle to see only Rs
    )
  )
).subscribe(console.log); 


