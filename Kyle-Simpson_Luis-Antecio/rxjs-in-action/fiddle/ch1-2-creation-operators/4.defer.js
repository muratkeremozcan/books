import { defer, of, timer, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Create an observable with given subscription function
// defer(observableFactory: function(): SubscribableOrPromise): Observable

// ex: Defer to get current date/time at the time of subscription

const s1$ = of(new Date());  // will capture current date time
const s2$ = defer(() => of(new Date())); // will capture date time at the moment of subscription

timer(2000).pipe(
  switchMap(() => merge(s1$, s2$))
).subscribe(console.log);