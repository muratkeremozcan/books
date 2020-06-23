import { from, interval } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

// map(): apply projection with each value from source
// signature: map(project: Function, thisArg: any): Observable

const source$ = from([
  { name: 'Joe', age: 30 },
  { name: 'Frank', age: 20 },
  { name: 'Ryan', age: 50 }
]);

const example$ = source$.pipe(
  map(({name}) => name)
)
example$.subscribe(console.log);

const example2$ = source$.pipe(
  map(({name, age}) => age + 10)
).subscribe(console.log);


//////////

// mapTo(): map emissions to constant value.
// signature: mapTo(value: any): Observable

const source2$ = interval(2000)

const mapToExample$ = source2$.pipe(
  mapTo('hello')
).subscribe(console.log);