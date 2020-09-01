import { from, interval } from 'rxjs';
import { filter } from 'rxjs/operators';

// filter(): emit values that pass the provided condition.
// signature: filter(select: Function, thisArg: any): Observable
// 💡 If you would like to complete an observable when a condition fails, check out takeWhile!


// filter objects based on property
// emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
const source = from([
  { name: 'Joe', age: 31 },
  { name: 'Bob', age: 25 }
]);
// filter out people with age under 30
const example = source.pipe(filter(person => person.age >= 30));
// output: "Over 30: Joe"
example.subscribe(val => console.log(`Over 30: ${val.name}`));


// emit every second
const source2 = interval(1000);
// filter out all values until interval is greater than 5
const example2 = source2.pipe(filter(num => num > 5));
/*
  "Number greater than 5: 6"
  "Number greater than 5: 7"
  "Number greater than 5: 8"
  "Number greater than 5: 9"
*/
example2.subscribe(val =>
  console.log(`Number greater than 5: ${val}`)
);