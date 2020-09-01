// repeat(): repeats an observable on completion.
// signature: repeat(count: number): Observable
// 💡 Like retry but for non error cases!

import { repeat, delay } from 'rxjs/operators';
import { of } from 'rxjs';

const delayedThing = of('delayed value').pipe(delay(2000));

delayedThing
  .pipe(repeat(3))
  // delayed value...delayed value...delayed value
  .subscribe(console.log);