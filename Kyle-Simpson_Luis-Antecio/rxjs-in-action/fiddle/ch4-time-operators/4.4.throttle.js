import { interval } from 'rxjs';
import { throttle, map } from 'rxjs/operators';

// Emit value on the leading edge of an interval, but suppress new values until durationSelector has completed.
// signature: throttle(durationSelector: function(value): Observable | Promise): Observable

const source1$ = interval(1000);
//throttle for 2 seconds, emit latest value

const source2$ = source1$.pipe(
  throttle(() => interval(4000))
);

source2$.subscribe(val => console.log(`source2$: ${val}`));


// promise example

// incrementally increase the time to resolve based on source
const promise = val => new Promise(resolve =>
  setTimeout(() => resolve(`Resolved: ${val}`), val * 4000))

const source3$ = source1$.pipe(
  throttle(promise),
  map(val => `Throttled off Promise: ${val}`)
);

// when promise resolves, emit from source1$

source3$.subscribe(val => console.log(`source2$: ${val}`));