import * as Rx from 'rxjs/Rx'

// you may want to make COLD/Uni observables into HOT/Multi with the intention of sharing their content 
// and avoiding not only duplicating your efforts but also duplicating resources.

// share() shares a single subscription to a stream  among multiple subscribers (COLD to HOT)
// you can place this operator right after a set of operations whose results should be common
// and the subscribers to each of them will all get the same instance without replaying the pipeline
// upon the first subscriber subscribing, the underlying stream is also subscribed to, 
// and when all the subscribers stop listening (either through error or cancellation), the underlying subscription is disposed of as well.

// this is your usual cold observable: unicast / every subscriber will get their unique data
const source$ = Rx.Observable.interval(1000)
  .take(10)
  .do(num => {
    console.log(`running some code with ${num}`);
  });

// with share() operator, you can convert the cold into a hot observable / unicast to multicast
const shared$ = source$.share();

// When the number of observers subscribed to a published observable goes from 0 to 1, you connect to the underlying observable sequence.
shared$.subscribe(createObserver('SourceA'));
// When the second subscriber is added, no additional subscriptions are added to the underlying observable sequence.
shared$.subscribe(createObserver('SourceB'));

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


// check out gulp examle 8.5 for the final stock ticker example

// be careful with the pitfall of sharing a synchronous cold observable
// When dealing with observables that run immediately, this can result in only a single subscriber receiving the events
// the book says only stream1 gets executed, but we see both...
const isEven = x => x % 2 === 0;
const synchronousSource$ = Rx.Observable.from([1, 2, 3, 4])
  .filter(isEven)
  .map(x => x * x)
  .share();

synchronousSource$.subscribe(x => console.log(`stream 1 ${x}`));
synchronousSource$.subscribe(x => console.log(`stream 2 ${x}`));