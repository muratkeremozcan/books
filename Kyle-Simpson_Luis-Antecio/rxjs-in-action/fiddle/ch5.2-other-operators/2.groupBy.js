// groupBy(): group into observables based on provided value.
// groupBy(keySelector: Function, elementSelector: Function): Observable

import { from, of, zip, merge } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';


const people = [
  { name: 'Sue', age: 25 },
  { name: 'Joe', age: 30 },
  { name: 'Frank', age: 25 },
  { name: 'Sarah', age: 35 }
];

// Example 1: Group by property

const source1$ = from(people);

const groupByProperty$ = source1$.pipe(
  groupBy(person => person.age), // group by age
  mergeMap(group => group.pipe(toArray())) // return each item in the group as an array
);

groupByProperty$.subscribe(val => console.log(val));
 

// Example 2: Group by into key - values

const groupByKeyValue$ = source1$.pipe(
  groupBy(
    person => person.age,
    person => person.name,
  ),
  mergeMap(
    group => zip(of(group.key), group.pipe(toArray()))
  )
);

groupByKeyValue$.subscribe(val => console.log(val));