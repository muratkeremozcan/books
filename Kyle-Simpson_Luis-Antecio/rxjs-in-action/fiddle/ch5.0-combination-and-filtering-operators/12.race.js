import { mapTo, take } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { race } from 'rxjs/observable/race';

// The observable to emit first is used. Analogous to Promise.race()


//take the first observable to emit
const example = race(
  interval(1500),
  interval(1000).pipe(mapTo('1s won!')),
  interval(2000),
  interval(2500)
).pipe(take(1))
  .subscribe(val => console.log(val));