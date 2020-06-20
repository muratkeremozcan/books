import { timer } from 'rxjs';
import { take, skip, delay } from 'rxjs/operators';

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
