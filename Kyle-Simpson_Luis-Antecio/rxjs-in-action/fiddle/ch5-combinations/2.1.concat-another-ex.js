import { of, concat, interval } from 'rxjs';

concat(
  of(1, 2, 3),
  // subscribed after first completes
  of(4, 5, 6),
  // subscribed after second completes
  of(7, 8, 9)
)
  // log: 1, 2, 3, 4, 5, 6, 7, 8, 9
  .subscribe(console.log);



/////
// side note

concat(
  interval(1000), // if a source never completes, any subsequent observables never run
  of('This', 'Never', 'Runs'))
  // log: 1,2,3,4.....
  .subscribe(console.log);


/////
// check out cool countdown example https://stackblitz.com/edit/typescript-jtzuaa?file=index.ts