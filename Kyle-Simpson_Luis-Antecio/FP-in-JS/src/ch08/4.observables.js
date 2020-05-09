const Rx = require('rxjs/Rx');

// an observable is any data provider. Reading a file, a web service call, querying a database, pushing system notifications, handling user input, traversing a collection of elements, or even parsing a simple string.
// Rx.Observable unifies all into an observable stream; allows to combine functional and reactive programming.
// To extract a value, we subscribe to it

Rx.Observable.range(1, 3).subscribe(
  x => console.log(`Next: ${x}`),
  err => console.log(`Error: ${err}`),
  () => console.log('Completed')
) //?

Rx.Observable.of(1, 2, 3, 4, 5)
  .filter(x => x % 2 !== 0)
  .map(x => x * x)
  .subscribe(x => console.log(`Next: ${x}`)); //?
  