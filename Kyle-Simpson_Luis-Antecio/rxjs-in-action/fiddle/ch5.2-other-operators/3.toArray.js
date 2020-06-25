// toArray(): collects all source emissions and emits them as an array when the source completes
// signature: toArray(): OperatorFunction

import { interval } from 'rxjs';
import { toArray, take } from 'rxjs/operators';

interval(100)
  .pipe(
    take(10),
    toArray() // toggle to see what it does
  ).subscribe(console.log);