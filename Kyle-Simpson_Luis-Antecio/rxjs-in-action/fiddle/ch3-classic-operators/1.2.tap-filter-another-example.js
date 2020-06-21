import { of } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

let stream$ = of(1,2,3,4,5);

let pipeline$ = stream$.pipe(
  filter(val => val % 2 === 0), // if we filter afterwards, it will not apply to the 'tap'
  tap(val => {
    console.log(`tap is useful for debugging your Observable, its mirror in dot notation is do: ${val}`);
  })
);

pipeline$.subscribe(); // we did not have to console.log  ins subscribe

