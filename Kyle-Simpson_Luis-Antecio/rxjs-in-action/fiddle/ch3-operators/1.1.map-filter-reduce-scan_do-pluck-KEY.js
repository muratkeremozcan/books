import * as Rx from 'rxjs/Rx';
// instead of you controlling what goes on a stream by creating a custom observable and pushing events through observer.next(), 
// it’s preferable to relinquish that control and react when the time comes using of, from, range, fromPromise etc. to wrap an event source

// simple map
const addSixPercent = x => x + (x * .06);

Rx.Observable.of(10, 20, 30, 40) // Rx.Observable.of(Observable)
  .map(addSixPercent) // stream / pipeline  
  .subscribe(console.log); // Observer


/** converts a collection of strings into comma-separated-value (CSV) array */
Rx.Observable.from([
  'The quick brown fox',
  'jumps over the lazy dog'
])
  .map(str => str.split(' '))
  .do(arr => console.log(arr.length)) // (aka tap) do is a util op useful to perform a side effect; debugging, tracing, logging into screen
  .subscribe(console.log);


//////
// also check out gulp 3.4 for filter example
// filter

let candidates = [
  { name: 'Brendan Eich', experience: 'JavaScript Inventor' },
  { name: 'Emmet Brown', experience: 'Historian' },
  { name: 'George Lucas', experience: 'Sci-fi writer' },
  { name: 'Alberto Perez', experience: 'Zumba Instructor' },
  { name: 'Bjarne Stroustrup', experience: 'C++ Developer' }
];

const hasJsExperience = bg => bg.toLowerCase().includes('javascript');

const candidates$ = Rx.Observable.from(candidates);

candidates$
  .filter(candidate => hasJsExperience(candidate.experience)) // SELECTs the object in the array
  .do(console.log) // console logs that object
  .map(filteredPerson => filteredPerson.name) // TRANSFORMs that object
  .subscribe(console.log)


/////
// reduce

/** used for add reducer */
const adder = (x, y) => x + y;

Rx.Observable.from([
  {
    date: '2016-07-01',
    amount: -320.00
  },
  {
    date: '2016-07-13',
    amount: 1000.00
  },
  {
    data: '2016-07-22',
    amount: 45.0
  }
])
  .pluck('amount') // pluck is used to extract the value at property/key
  .reduce(adder, 0) // initial value of 0 is optional
  .subscribe(console.log)


// reduce with filter

const isTechnical = candidate => {
  const bg = candidate.experience.toLowerCase();
  return bg.includes('javascript') || bg.includes('c++');
};

const accumulateNames = (acc, candidate) => {
  acc.push(candidate.name);
  return acc;
};

// we can re-use candidate$ because each invocation of subscribe() spins off a brand-new pipeline
// that will be independent of any other pipelines that were created by subsequent calls to subscribe().
// remember: const candidates$ = Rx.Observable.from(candidates);

candidates$
  .filter(isTechnical)
  .reduce(accumulateNames, []) // start with an empty array and push candidate names that got selected with filter
  .subscribe(console.log)


/////
// scan
// scan() applies an accumulator function over an observable sequence (just like reduce())
// but returns each intermediate result as the accumulation process is happening and not all at once. 
// This is useful to obtain progress information about how data is being aggregated with each event.

candidates$
  .filter(isTechnical)
  .scan(accumulateNames, []) // basically a version of reduce, where the accumulator is output every iteration
  .subscribe(console.log)