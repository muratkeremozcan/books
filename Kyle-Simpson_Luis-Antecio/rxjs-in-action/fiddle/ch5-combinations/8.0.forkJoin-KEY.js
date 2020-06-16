import * as Rx from 'rxjs/Rx';

// contrast to combineLatest(): When all observables complete, forkJoin() emits the last emitted value from each
// combineLatest() would instead get the most recent as of for example an interval
// acts more like Promise.all vs combineLatest(), because it does not pulse but gives the final value instead

// One common use case for this is if you wish to issue multiple requests on page load (or some other event)
// and only want to take action when a response has been received for all

// note: internal Observable errors are omitted. If you want the yield them, catch them on the outside / at the end
//  If an inner observable does not complete forkJoin will never emit a value

const source1$ = Rx.Observable.from(['a', 'b', 'c']);
const source2$ = Rx.Observable.from([1, 2, 3]);

Rx.Observable.forkJoin(source1$, source2$)
  .subscribe(console.log)

/////

const letter$ = Rx.Observable.interval(1000)
  .map(num => String.fromCharCode(65 + num)) // fromCharCode returns a string based on the character code: String.fromCharCode(65, 66, 67);  // returns "ABC"
  .map(letter => `Source 1 -> ${letter}`);

const number$ = Rx.Observable.interval(1000)
  .map(num => `Source 2 -> ${num}`);

Rx.Observable.forkJoin(letter$.take(5), number$.take(5))
  .subscribe(console.log)

//////

Rx.Observable.forkJoin(
  Rx.Observable.of(42),
  Rx.Observable.interval(1000).take(5))
  .subscribe(console.log)


// check out 6.8 gulp for a complex example