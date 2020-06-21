// Share source utilizing the provided Subject
// signature: multicast(selector: Function): Observable

import { Subject, interval } from 'rxjs';
import { take, tap, multicast, mapTo } from 'rxjs/operators';

//emit every 2 seconds, take 5
const source1$ = interval(2000).pipe(take(5));

const source2$ = source1$.pipe(
  //since we are multicasting below, side effects will be executed once
  tap(() => console.log('Side Effect #1')),
  mapTo('Result!')
);

//subscribe subject to source1$ upon connect()
const multi = source2$.pipe(multicast(() => new Subject()));
/*
  subscribers will share source1$
  output:
  "Side Effect #1"
  "Result!"
  "Result!"
  ...
*/

multi.subscribe(val => console.log(val));
multi.subscribe(val => console.log(val));

//subscribe subject to source1$
multi.connect();
