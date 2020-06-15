import { of } from 'rxjs';
import { startWith, merge, concat, scan } from 'rxjs/operators';

const source1$ = of(1, 2, 3);

const source2$ = source1$
  .pipe(
    startWith(-3, -2, -1, 0), // can startWith() multiple values
    merge(of(4)),
    concat(of(5))
  );

source2$.subscribe(console.log);



////// 
const source3$ = of('World!', 'Goodbye', 'World!');

const scanExample$ = source3$
  .pipe(
    startWith('Hello'),
    scan((acc, curr) => `${acc}, ${curr}`) 
    // to get a similar output you would add an initial val -still not the same with it- , 'Hello'
  );

scanExample$.subscribe(console.log);