import { interval, zip, from } from 'rxjs';
import { sample } from 'rxjs/operators';


// sample(): sample from source when provided observable emits
// signature: sample(sampler: Observable): Observable

const sourceInterval$ = interval(1000);

const sampleEveryTwelveSecs$ = sourceInterval$.pipe(
  sample(interval(12000))
)

sampleEveryTwelveSecs$.subscribe(
  val => console.log(`simple every 12 secs: ${val}`),
  null,
  () => console.log('complete')
);


// another example 

const source = zip(
  // emit 'Joe', 'Frank' and 'Bob' in sequence
  from(['Joe', 'Frank', 'Bob', 'Luis', 'Mark']),
  //emit value every 2s
  interval(2000)
);
//sample last emitted value from source every 2.5s
const example = source.pipe(sample(interval(2500)));
//output: ["Joe", 0]...["Frank", 1]...........
const subscribe = example.subscribe(val => console.log(val));