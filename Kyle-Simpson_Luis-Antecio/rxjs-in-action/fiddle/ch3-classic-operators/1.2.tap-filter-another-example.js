import { of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

// tap: Transparently perform actions or side-effects, such as logging. Useful for debugging your Observable
// tap(nextOrObserver: function, error: function, complete: function): Observable
// 💡 If you are using as a pipeable operator, do is known as tap!


const stream$ = of(1,2,3,4,5);

const pipeline$ = stream$.pipe(
  tap(val => console.log(`tap before filter: ${val}`)),
  filter(val => val % 2 === 0), // if we filter afterwards, it will not apply to the 'tap'
  tap(
    val =>  console.log(`tap after filter: ${val}`),
    err => console.log(err),
    () => console.log('2nd tap complete')
  )
);

pipeline$.subscribe(); // we did not have to console.log  ins subscribe



// exapmle: using tap with object

const example2$ = stream$.pipe(
  map(val => val + 10),
  tap({
    next: val => console.log(`on next: ${val}`),
    error: err => console.log(`on error: ${err}`),
    complete: () => console.log('2nd example complete')
  })
);

example2$.subscribe(console.log);