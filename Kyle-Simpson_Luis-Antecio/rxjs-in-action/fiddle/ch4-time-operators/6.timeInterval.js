// timeInterval(): convert an Observable that emits items into one that emits indications of the amount of time elapsed between those emissions
// timeInterval(scheduler: *): Observable<TimeInterval<any>> | WebSocketSubject<T> | Observable<T>

https://stackblitz.com/edit/rxjs-time-interval?file=index.ts&devtoolsheight=50

import { fromEvent } from 'rxjs';
import { timeInterval, tap } from 'rxjs/operators';

fromEvent(document, 'mousedown')
  .pipe(timeInterval(), tap(console.log))
  .subscribe(
    i =>
      (document.body.innerText = `milliseconds since last click: ${i.interval}`)
  );