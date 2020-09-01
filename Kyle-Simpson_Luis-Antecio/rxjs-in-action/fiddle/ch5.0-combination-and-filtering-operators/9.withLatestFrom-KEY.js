import { withLatestFrom, map } from 'rxjs/operators';
import { interval } from 'rxjs';


// Also provide the last value from another Observable.
// contrast with combineLatest(): this one takes 1 observable vs combining many
// withLatestFrom() emits only when the second Observable emits
// combineLatest() emits the the last emission any time one of the observables emit, 

// combineLatest(observables: ...Observable, project?: function): Observable
// withLatestFrom(other: Observable, project?: Function): Observable

// to see a different example, switch the naming of the sources
const source1$ = interval(5000);
const source2$ = interval(1000);

const stream = source1$.pipe(
  withLatestFrom(source2$),
  map(([first, second]) => `Source1: ${first}, Latest from Source2: ${second}`) // the project funtion is optional
) 

stream.subscribe(console.log);