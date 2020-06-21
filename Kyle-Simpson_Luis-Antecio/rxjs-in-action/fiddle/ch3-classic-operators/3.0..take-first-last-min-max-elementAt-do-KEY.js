import * as Rx from 'rxjs/Rx';

// take(): emit provided number of values before completing
// signature: take(count: number): Observable

// when you are interested in only the first emission, you want to use take().
// Maybe you want to see what the user first clicked on when they entered the page, or you would want to subscribe to the click event and just take the first emission. 

// Another use-case is when you need to take a snapshot of data at a particular point in time but do not require further emissions. 
// For example, a stream of user token updates, or a route guard based on a stream in an Angular application.

// 💡 If you want to take a variable number of values based on some logic, or another observable, you can use takeUntil or takeWhile!
// 💡 take is the opposite of skip where take will take the first n number of emissions while skip will skip the first n number of emissions.
// https://www.learnrxjs.io/learn-rxjs/operators/filtering/take

let candidates = [
  { name: 'Brendan Eich', experience: 'JavaScript Inventor' },
  { name: 'Emmet Brown', experience: 'Historian' },
  { name: 'George Lucas', experience: 'Sci-fi writer' },
  { name: 'Alberto Perez', experience: 'Zumba Instructor' },
  { name: 'Bjarne Stroustrup', experience: 'C++ Developer' }
];

const candidates$ = Rx.Observable.from(candidates);

// take : takes a set amount of data from the observable: will take 'Javascript Inventor' and 'Historian'
candidates$
  .pluck('experience')// pluck is used to extract the value at property/key
  .take(2) // take returns a specified count of elements from the Observable stream
  .do(val => console.log(`visiting ${val}`)) // (aka tap) do is a util op useful to perform a side effect; debugging, tracing, logging into screen
  .subscribe(console.log);

// first: will take Brendan Eich
candidates$
  .pluck('name')
  .first() // returns the first element in the Observable stream
  .subscribe(console.log);

// last : 'Bjarne Stroustrup'
candidates$
  .pluck('name')
  .last() // returns the last element in the Observable stream
  .subscribe(console.log);

// min : takes the alphabetical minimum for the property: 'Alberto Perez'
  .pluck('name')
  .min() // returns the min value in the Observable stream
  .subscribe(console.log);

// max : will get 'Zumba Instructor'
candidates$
  .pluck('experience')
  .max() // returns the max value in the Observable stream
  .subscribe(console.log);


// get nth item
candidates$
  .elementAt(2) // returns the element at index  n
  // .pluck('experience') // note that we can change the location in the chain; it can come before
  .subscribe(console.log);

// all operators at http://reactivex.io/documentation/operators.html