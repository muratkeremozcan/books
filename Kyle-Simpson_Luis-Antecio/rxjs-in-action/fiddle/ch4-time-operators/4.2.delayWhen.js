// delayWhen(): delay emitted values determined by provided function
// delayWhen(selector: Function, sequence: Observable): Observable

import { interval, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

const message = interval(1000);

const delayForFiveSeconds = () => timer(5000);

const delayWhenExample = message.pipe(
  delayWhen(delayForFiveSeconds)
);

delayWhenExample.subscribe(console.log);