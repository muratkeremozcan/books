import { Observable, Observer, of, Subscription, from, interval, pipe } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';
import 'rxjs/Rx';

// the switchMap operator handles the data from the outer observable but cancels the
// inner subscription being processed if the outer observable emits a new value.

let outer$ = interval(1000) // outer Observable
  .pipe(take(2));; // take operator takes only first 2 items from the stream

let combined$ = outer$.pipe(
  switchMap((x) => {
    return interval(400) // inner observable
      .pipe(
        take(3),
        map(y => `outer ${x}: inner ${y}`)
      )
  })
  );

combined$.subscribe(result => console.log(`${result}`));


// 1 The outer observable emits 0 and the inner emits 0 400 ms later.
// 2 800 ms later, the inner observable emits 1.
// 3 In 1000 ms, the outer observable emits 1, and the inner observable is unsub// scribed.
// 4 The three inner emissions for the second outer value went uninterrupted because it didn’t emit any new values.