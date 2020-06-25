import { interval } from 'rxjs';
import { take, buffer, delay } from 'rxjs/operators';

/*
buffer() : collect output values until provided observable emits, emit as array.
buffer( closingNotifier )
*/

const scissor$ = interval(500);

const emitter$ = interval(100)
  .pipe(
    take(10),
    buffer(scissor$)
  )
  .subscribe(val => console.log(`emitter 1 release: ${val}`));


const emitter2$ = interval(250)
    .pipe(
      take(10),
      buffer(scissor$)
    )
    .subscribe(val => console.log(`emitter 2 release: ${val}`))



// DOM examples https://www.learnrxjs.io/learn-rxjs/operators/transformation/buffer