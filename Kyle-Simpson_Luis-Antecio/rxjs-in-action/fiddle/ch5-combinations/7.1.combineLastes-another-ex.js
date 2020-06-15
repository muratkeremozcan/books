import { timer, combineLatest } from 'rxjs';

let start = new Date();

// timerOne emits first value at 1s, then once every 4s
const timerOne$ = timer(1000, 4000);
// timerTwo emits first value at 2s, then once every 4s
const timerTwo$ = timer(2000, 4000);
// timerThree emits first value at 3s, then once every 4s
const timerThree$ = timer(3000, 4000);

// when one timer emits, emit the latest values from each timer as an array
const stream$ = combineLatest(timerOne$, timerTwo$, timerThree$);

stream$.subscribe(
  ([timerOneVal, timerTwoVal, timerThreeVal]) => { // can use array or object destructuring
    console.log(`
      ${new Date() - start}ms : 
      Timer One Latest: ${timerOneVal},
      Timer Two Latest: ${timerTwoVal},
      Timer Three Latest: ${timerThreeVal}`
    )
  }
)