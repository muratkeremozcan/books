import { timer } from 'rxjs';
import { bufferTime, take, delay } from 'rxjs/operators';

// bufferTime(): collect emitted values until provided time has passed, emit as array
// bufferTime(bufferTimeSpan: number, bufferCreationInterval: number, scheduler: Scheduler): Observable

const source1$ = timer(0, 500);

// after 2 seconds have passed, emit buffered values as an array
const example1$ = source1$.pipe(
  take(12),
  bufferTime(2000)
);

example1$.subscribe(val =>
  console.log(`Buffered with Time: ${val}`)
);


/*
bufferTime also takes second argument, when to start the next buffer (time in ms)
for instance, if we have a bufferTime of 2 seconds but second argument (bufferCreationInterval) of 4 second:
*/

const example2$ = source1$.pipe(
  take(12),
  bufferTime(2000, 4000) // take for 2 seconds, skip the next 2 seconds, emit the next 2 seconds
);

example2$.subscribe(val =>
  console.log(`start buffer every 4s: ${val}`)
);
