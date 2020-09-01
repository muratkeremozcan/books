import { interval } from 'rxjs';
import { take, skip } from 'rxjs/operators';

interval(1000)
  .pipe(
    skip(1), // remember : take is the opposite of skip
    take(5) // don't let it go forever
  )
  .subscribe(console.log);