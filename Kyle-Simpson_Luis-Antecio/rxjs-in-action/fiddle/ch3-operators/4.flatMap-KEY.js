import { of, from, range } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

// you may run into this situation when converting when Observable to another during the pipeline

let stream$ = from([1, 2, 3])
  .pipe(
    map(val => of(val)
      .pipe(
        map(v => v)
      )
    )
  )

// regular map gives the full Observable
// 1------2-----3------>
// Observable, Observable, Observable
stream$.subscribe(console.log);


let streamFlatMap$ = range(1, 3)
  .pipe(
    flatMap(val => of(val)
      .pipe(
        map(v => v)
      )
    )
  )

// flatMap can unwind it for you 
// --1------2-----3------>
// --json-- json--json -->
streamFlatMap$.subscribe(console.log);