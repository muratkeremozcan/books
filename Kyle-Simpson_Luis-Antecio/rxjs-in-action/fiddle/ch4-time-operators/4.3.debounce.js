import { of, timer, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

// debounce(): discard emitted values that take less than the specified time, based on selector function, between output.
// signature: debounce(durationSelector: function): Observable
// 💡 Though not as widely used as debounceTime, debounce is important when the debounce rate is variable!


const fourStrings$ = of('WAIT', 'ONE', 'SECOND', 'Last will display');

// Only emit values after a second has passed between the last emission, throw away all other values
const debounceExample$ = fourStrings$.pipe(
  debounce(()=> timer(1000))
);

// In this example, all values but the last will be omitted
debounceExample$.subscribe(console.log)


////

const interval$ = interval(1000);

// raise debounce time by 200 ms each second
const debounceItnerval$ = interval$.pipe(
  debounce(val => timer(val * 200))
);

/*
  After 5 seconds, debounce time will be greater than interval time,
  all future values will be thrown away
  output: 0...1...2...3...4......(debounce time over 1s, no values emitted)
*/
debounceItnerval$.subscribe(console.log); 