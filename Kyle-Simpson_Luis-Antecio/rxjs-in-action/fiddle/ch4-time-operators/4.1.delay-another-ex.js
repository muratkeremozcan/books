import { timer, of, merge } from 'rxjs';
import { take, skip, delay, mapTo } from 'rxjs/operators';

// delay(): delay emitted values by given time
// delay(delay: number | Date, scheduler: Scheduler): Observable


let start = new Date();

// starts counting at 1 (skipping 0)
const stream$ = timer(0, 1000)
  .pipe(
    skip(1),
    take(5)
  );

stream$
  .pipe(
    delay(5000) // will shift it all by 5 secs, we will see counting from 6
  )
  .subscribe(
    x => {
      console.log(`val: ${x} at second ${new Date() - start}`);
    },
    null,
    () => console.log('completed')
  );


// example: delay for increasing durations

// emit one item
const example = of(null);
// delay output of each by an extra second
const message = merge(
  example.pipe(mapTo('Hello')),
  example.pipe(mapTo('World!'), delay(6000)),
  example.pipe(mapTo('Goodbye'), delay(7000)),
  example.pipe(mapTo('World!'), delay(8000))
);
// output: 'Hello'...'World!'...'Goodbye'...'World!'
const subscribe = message.subscribe(val => console.log(val));