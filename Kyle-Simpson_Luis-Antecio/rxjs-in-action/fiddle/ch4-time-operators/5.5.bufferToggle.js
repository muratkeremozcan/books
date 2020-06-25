// bufferToggle(): toggle on to catch emitted values from source, toggle off to emit buffered values as array
// bufferToggle(openings: Observable, closingSelector: Function): Observable

import { timer, interval } from 'rxjs';
import { bufferToggle } from 'rxjs/operators';

const sourceInterval1$ = timer(0, 1000);

// start first buffer after 5s, and every 5s after
const startInterval1$ = timer(0, 5000);

// emit value after 3s, closing corresponding buffer
const closingSelector$ = val => {
  console.log(`Value ${val} emitted, starting buffer! Closing in 3s!`);
  return interval(3000);
};

// every 5s a new buffer will start, collecting emitted values for 3s then emitting buffered values

const bufferToggleExample$ = sourceInterval1$.pipe(
  bufferToggle(startInterval1$, closingSelector$ )
);

bufferToggleExample$.subscribe(val =>
  console.log('Emitted Buffer:', val)
);

