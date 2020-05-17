import Rx from 'rxjs/Rx';

let candidates = [
  { name: 'Brendan Eich', experience: 'JavaScript Inventor' },
  { name: 'Emmet Brown', experience: 'Historian' },
  { name: 'George Lucas', experience: 'Sci-fi writer' },
  { name: 'Alberto Perez', experience: 'Zumba Instructor' },
  { name: 'Bjarne Stroustrup', experience: 'C++ Developer' }
];

const candidates$ = Rx.Observable.from(candidates);

// take 
candidates$
  .pluck('experience')// pluck is used to extract the value at property/key
  .take(2) // take returns a specified count of elements from the Observable stream
  .do(val => console.log(`visiting ${val}`)) // (aka tap) do is a util op useful to perform a side effect; debugging, tracing, logging into screen
  .subscribe(console.log);

// first
candidates$
  .pluck('name')
  .first() // returns the first element in the Observable stream
  .subscribe(console.log);

// last
candidates$
  .pluck('name')
  .last() // returns the last element in the Observable stream
  .subscribe(console.log);

// min
candidates$
  .pluck('name')
  .min() // returns the min value in the Observable stream
  .subscribe(console.log);

// max
candidates$
  .pluck('name')
  .max() // returns the max value in the Observable stream
  .subscribe(console.log);


// get nth item
candidates$
  .elementAt(2) // returns the element at index  n
  .subscribe(console.log);

// all operators at http://reactivex.io/documentation/operators.html