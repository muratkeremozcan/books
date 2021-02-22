import { interval } from 'rxjs';
import { bufferCount, take, delay } from 'rxjs/operators';

// buffer(): collect emitted values until provided number is fulfilled, emit as array
// bufferCount(bufferSize: number, whenToEndBuffer: number = null): Observable


// example : collect buffer and emit after specified number of values

const source1$ = interval(1000);

const bufferThree = source1$.pipe(
  take(10),
  bufferCount(3)
);

bufferThree.subscribe(val =>  console.log('Buffered Values:', val));


// example: overlapping buffers
/*
bufferCount also takes second argument, when to start the next buffer
for instance, if we have a bufferCount of 3 but second argument (whenToEndBuffer) of 6:
the buffer size will be 3 but it will emit and end when there are 6 more items
*/

const source2$ = interval(1000);

const bufferEveryOne = source2$.pipe(
  delay(10000),
  take(10),
  bufferCount(3, 6) // will emit 3, skip 3, emit 3 and end
);

bufferEveryOne.subscribe(val => console.log('Start Buffer Every 3:', val));