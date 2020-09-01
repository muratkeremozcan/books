// Share source and replay specified number of emissions on subscription.
// shareReplay(bufferSize?: number, windowTime?: number, scheduler?I IScheduler): Observable

// You generally want to use shareReplay when you have side-effects or taxing computations 
// that you do not wish to be executed amongst multiple subscribers. 
// It may also be valuable in situations where you know you will have late subscribers to a stream that need access to previously emitted values. 
// This ability to replay values on subscription is what differentiates share and shareReplay.



import { take, shareReplay, tap } from 'rxjs/operators';
import { interval } from 'rxjs/'

const source$ = interval(1000).pipe(
  take(5),
  tap(num => {
    console.log(`running some code with ${num}`);
  })
);

// an observable that can store two past events and reemit them to any new subscribers
const shared$ = source$.pipe(shareReplay(2));


// Subscriber A connects subscribers immediately, and begins receiving events from count 0.
shared$.subscribe(createObserver('SubA'));

// Subscribing 5 seconds later, subscriber B should begin receiving events starting with the number 4,
// but because of the replay it will first receive 2 and 3 (right before 4)
setTimeout(() => {
  shared$.subscribe(createObserver('SubB'));
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