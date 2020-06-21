import { timer, combineLatest } from 'rxjs';

// projection function makes the output easier

let start = new Date();

const timerOne$ = timer(1000, 4000);
const timerTwo$ = timer(2000, 4000);
const timerThree$ = timer(3000, 4000);

// this way you do not have to destructure in the observer
const stream$ = combineLatest(timerOne$, timerTwo$, timerThree$,
    (one, two, three) => `
      ${new Date() - start}ms : 
      Timer One Latest: ${one},
      Timer Two Latest: ${two},
      Timer Three Latest: ${three}`
  );

stream$.subscribe(console.log)

// check out example Combining events from 2 buttons
https://stackblitz.com/edit/typescript-ihcxud?file=index.ts&devtoolsheight=50