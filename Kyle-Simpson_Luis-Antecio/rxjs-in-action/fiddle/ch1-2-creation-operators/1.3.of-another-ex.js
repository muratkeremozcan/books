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

// source$.subscribe(val => {
//   console.log(val)
// });
export class Device {
  id
  name

  constructor(id, name, params = {}) {
    Object.assign(this, params);
    this.id = id;
    this.name = name;
  }
}

of([new Device('d-1', 'D 1'), new Device('c-1', 'C 1')]).subscribe(console.log); 

of([1, 2, 3]).subscribe(console.log);