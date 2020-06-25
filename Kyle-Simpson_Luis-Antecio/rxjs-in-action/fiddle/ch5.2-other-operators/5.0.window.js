import { timer, interval } from 'rxjs';
import { window, scan, mergeAll } from 'rxjs/operators';

// window(): observable of values for window of time.
// signature: window(windowBoundaries: Observable): Observable

// Example: Open window specified by inner observable

const source = timer(0, 1000);

const example = source.pipe(
  window(interval(3000))
);

const count = example.pipe(
  scan((acc, current) => acc + 1, 0)
);

const subscribe = count.subscribe(val => console.log(`Window ${val}:`));
const subscribeTwo = example
  .pipe(mergeAll())
  .subscribe(val => console.log(val));