import * as Rx from 'rxjs/Rx';

// combineLatest: for cases where multiple streams must run in parallel, but only emit when both are ready 
// (analogus to Promise.all, but we have streams instead of one-time values)
// contrast: no combining by interleaving-merge(), sequencing-concat(), cancelling-1st-stream-and-switch()...
// or taking-1st-stream-Until-2nd-stream-kicks-in with takeUntil()

// Generally, causal streams (one depends on the other) are combined using mergeMap(), switchMap(), exhaustMap(), even takeUntil()
// whereas independent streams are combined using combineLatest(), forkJoin()



// With synchronous data sources, you have to be careful 
// because RxJS will immediately run through the events of the first source stream 
// and combine its latest value ('c') with the latest value of the combined stream 
// instead of pairing each number with a letter.

const source1$ = Rx.Observable.from(['a', 'b', 'c']);
const source2$ = Rx.Observable.from([1,2,3]);

Rx.Observable.combineLatest(source1$, source2$)
  .subscribe(console.log)

/////

// when source 1 emits, it sends the result with the latest value in source 2 at the time, vice versa
const letter$ = Rx.Observable.timer(0, 1000)
  .map(num => String.fromCharCode(65 + num)) // fromCharCode returns a string based on the character code: String.fromCharCode(65, 66, 67);  // returns "ABC"
  .map(letter => `Source 1 -> ${letter}`);

const number$ = Rx.Observable.timer(0, 1000)
  .map(num => `Source 2 -> ${num}`);

Rx.Observable.combineLatest([letter$.take(5), number$.take(5)])
  // .take(5) // would be different if enabled; it would periodically take the result as each observable is ready
  .subscribe(console.log)



// check out 6.5 gulp for a complex example