import * as Rx from 'rxjs/Rx';
import { set } from 'ramda';

// publishReplay() to emit the last x number or all of the most recent values to all subscribers


const source$ = Rx.Observable.interval(1000)
  .take(5)
  .do(num => {
    console.log(`running some code with ${num}`);
  });

// if you only want the last value, use publishLast()
// publishLast() multicasts the last observable value from a sequence to all subscribers.
const published$ = source$.publishLast();


published$.subscribe(createObserver('SubA'));

published$.connect();
setTimeout(() => {
  published$.subscribe(createObserver('SubB'));
}, 5000);

// further info https://github.com/ReactiveX/rxjs/blob/master/src/operator/publish.ts





/** Helper method to create a simple observer for standard out */
function createObserver(tag) {
  return {
    next: x => {
      console.log(`Next: ${tag} ${x}`);
    },
    error: err => {
      console.log(`Error: ${err}`);
    },
    complete: () => {
      console.log('completed');
    }
  };
}