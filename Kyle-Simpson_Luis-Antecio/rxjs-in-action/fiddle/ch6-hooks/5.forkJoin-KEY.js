import Rx from 'rxjs/Rx';

// In contrast to combineLatest(), forkJoin() emits only the latest values from each of the input observables
// So if a sequence emits five values, it will sit there and wait for the last one
// combineLatest() would instead get the most recent as of for example an interval


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