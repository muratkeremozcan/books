// timeoutWith(): subscribe to second Observable if no emission occurs in given time span.
// timeoutWith(due: number | Date, withObservable: ObservableInput, scheduler: SchedulerLike = async): OperatorFunction

import { of } from 'rxjs';
import { timeoutWith, delay, concatMap } from 'rxjs/operators';

const fakeRequest = delayTime => of('!response!').pipe(delay(delayTime));
const requestTimeoutLogger = of('logging request timeout');
const timeoutThreshold = 1000;

of(timeoutThreshold + 1, timeoutThreshold - 1, timeoutThreshold + 3).pipe(
  concatMap(e =>
    fakeRequest(e).pipe(
      timeoutWith(timeoutThreshold, requestTimeoutLogger)
    )
  )
).subscribe(console.log)
