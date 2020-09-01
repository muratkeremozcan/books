// pluck(): select property to emit.
// signature: pluck(properties: ...args): Observable

// RxJS v6+
import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';

const source = from([
  { name: 'Joe', age: 30 },
  { name: 'Sarah', age: 35 }
]);
// output: "Joe", "Sarah"
source.pipe(
  pluck('name')
).subscribe(console.log);


// example: pluck nested propertie

const source2 = from([
  { name: 'Joe', age: 30, job: { title: 'Developer', language: 'JavaScript' } },
  // will return undefined when no job is found
  { name: 'Sarah', age: 35 }
]);
// output: "Developer" , undefined
source2.pipe(
  pluck('job', 'title')
).subscribe(console.log);