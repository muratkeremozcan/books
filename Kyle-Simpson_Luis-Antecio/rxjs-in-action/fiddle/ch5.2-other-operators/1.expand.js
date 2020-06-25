// expand(): recursively call provided function
// expand(project: function, concurrent: number, scheduler: Scheduler): Observable

import { of } from 'rxjs';
import { expand, take } from 'rxjs/operators';

const source = of(2);

const example = source.pipe(
  expand(val => { // recursively call the provided function
    console.log(`Passed value ${val}`);
    return of(1 + val);
  }),
  take(5) // set the times of recursion
);

example.subscribe(val => console.log(`RESULT: ${val}`));