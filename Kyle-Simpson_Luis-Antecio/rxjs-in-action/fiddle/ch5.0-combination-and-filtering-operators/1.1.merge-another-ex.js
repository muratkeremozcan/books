import { interval } from 'rxjs';
// import { merge } from 'rxjs'; // comment out for instance method usage
import { mapTo, take, map } from 'rxjs/operators';

//emit every 2.5 seconds
const first = interval(2500);
//emit every 2 seconds
const second = interval(2000);
//emit every 1.5 seconds
const third = interval(1500);
//emit every 1 second
const fourth = interval(1000);

const stream$ = merge(
  first.pipe(mapTo('FIRST!')), // mapTo(`First`) is the same as map( () => 'First')
  second.pipe(mapTo('SECOND!')),
  third.pipe(mapTo('THIRD')),
  fourth.pipe(mapTo('FOURTH'))
)

// could also do instance method
// GOTCHA: you have to import merge as an operator though and from base 'rxjs'
// import { merge } from 'rxjs/operators';

// const stream$ =
//   first.pipe(
//     merge(first.pipe(mapTo('FIRST'))),
//     merge(second.pipe(mapTo('SECOND'))),
//     merge(third.pipe(mapTo('THIRD'))),
//     merge(fourth.pipe(mapTo('FOURTH')))
//   );

stream$.subscribe(console.log);