import { timer } from 'rxjs';
import { take, skip } from 'rxjs/operators';

// timer can act in several ways depending on how you call it. 
// signature: timer(initialDelay , thereafter?)

timer(1000).subscribe(
  value => console.log(value),
  null,
  () => console.log('completed the 1st one after 1 second')
);

// starts at 2 seconds, emits every one.
// because of the initial delay capability, it's better than interval()
// also, it can start at 0 while interval() has to start at the first delay

timer(2000, 1000)
  .pipe(
    skip(1),
    take(5)
  )
  .subscribe(console.log)