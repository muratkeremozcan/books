import { of } from 'rxjs';

// Emit variable amount of values in a sequence and then emits a complete notification.
// signature: of(...values, scheduler: Scheduler): Observable

// the values can be any synchronous JS object, including a function

const source$ = of(
  1,
  '2',
  [3,4,5],
  true,
  {name: 'Murat'},
  function helo() {
    return 'Hello';
  }
);

source$.subscribe(val => {
  console.log(val)
});