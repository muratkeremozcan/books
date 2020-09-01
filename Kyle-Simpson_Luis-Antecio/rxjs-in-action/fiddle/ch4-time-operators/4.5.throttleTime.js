import { interval, asyncScheduler  } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

// Emit first value then ignore for specified duratio
// signature: throttleTime(duration: number, scheduler: Scheduler, config: ThrottleConfig): Observable

const source1$ = interval(1000);

const source2$ = source1$.pipe(
  throttleTime(4000)
);

source2$.subscribe(val => console.log(`source1$: ${val}`));



// asyncScheduler example
const source3$ = source1$.pipe(
  throttleTime(5000, asyncScheduler, { trailing: true})
);

source3$.subscribe(console.log);