// reduce(): Reduces the values from source observable to a single value that's emitted when the source completes.
// signature: reduce(accumulator: function, seed: any): Observable
// 💡 Just like Array.prototype.reduce()
// 💡 If you need the current accumulated value on each emission, try scan!

import { of, Subject, interval } from 'rxjs';
import { reduce, scan, map, distinctUntilChanged, delay, mergeMap } from 'rxjs/operators';

const source1$ = of(1, 2, 3, 4);
const example1$ = source1$.pipe(reduce((acc, val) => acc + val));
// output: Sum: 10'
example1$.subscribe(val => console.log('Sum:', val));


// scan(): reduce over time.
// signature: scan(accumulator: function, seed: any): Observable
const example2$ = source1$.pipe(scan((acc, val) => acc + val, 0));
example2$.subscribe(console.log);



// state management : accumulating an object

const subject = new Subject();
//scan example building an object over time
const example2 = subject.pipe(
  scan((acc, curr) => Object.assign({}, acc, curr), {})
);
//log accumulated values
example2.subscribe(val =>
  console.log('Accumulated object:', val)
);
//next values into subject, adding properties to object
// {name: 'Joe'}
subject.next({ name: 'Joe' });
// {name: 'Joe', age: 30}
subject.next({ age: 30 });
// {name: 'Joe', age: 30, favoriteLanguage: 'JavaScript'}
subject.next({ favoriteLanguage: 'JavaScript' });


// example: emitting random values from the accumulated array.

// Accumulate values in an array, emit random values from this array.
const scanObs = interval(1000)
  .pipe(
    scan((a, c) => [...a, c], []),
    map(r => r[Math.floor(Math.random() * r.length)]),
    distinctUntilChanged()
  )
  .subscribe(console.log);



// Accumulating http responses over time

const fakeRequest = of('response').pipe(delay(2000));

// output:
// ['response'],
// ['response','response'],
// ['response','response','response'],
// etc...

interval(1000)
  .pipe(
    mergeMap(_ => fakeRequest),
    scan((all, current) => [...all, current], [])
  )
  .subscribe(console.log);