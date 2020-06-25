// timeout(): error if no value is emitted before specified duration
// timeout(due: number, scheduler: Scheduler): Observable

import { of } from 'rxjs';
import { concatMap, timeout, catchError, delay } from 'rxjs/operators';


// simulate request
function makeRequest(timeToDelay) {
  return of('Request Complete!').pipe(delay(timeToDelay));
}

of(4000, 3000, 2000).pipe(
  concatMap(duration =>
    makeRequest(duration).pipe(
      timeout(2500),
      catchError(error => of(`Request timed out after: ${duration}`))
    )
  )
).subscribe(console.log);