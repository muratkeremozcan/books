import * as Rx from 'rxjs/Rx';
import { set } from 'ramda';

// publishReplay() to emit the last x number or all of the most recent values to all subscribers


const source$ = Rx.Observable.interval(1000)
  .take(10)
  .do(num => {
    console.log(`running some code with ${num}`);
  });

// an observable that can store two past events and reemit them to any new subscribers
const published$ = source$.publishReplay(2);

published$.connect();

// Subscriber A connects subscribers immediately, and begins receiving events from count 0.
published$.subscribe(createObserver('SubA'));

// Subscribing 5 seconds later, subscriber B should begin receiving events starting with the number 4,
// but because of the replay it will first receive 2 and 3 (right before 4)
setTimeout(() => {
  published$.subscribe(createObserver('SubB'));
}, 5000);





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