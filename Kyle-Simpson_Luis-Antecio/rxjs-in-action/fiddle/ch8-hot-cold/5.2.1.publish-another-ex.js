import { interval } from 'rxjs';
import { publish, tap } from 'rxjs/operators';

// Share source and make hot by calling connect
// signature: publish() : ConnectableObservable

const source1$ = interval(1000);

const source2$ = source1$.pipe(
  tap(() => console.log('do something')),
  publish() // do nothing until connect() is called
);

source1$.subscribe(val => console.log(`sub1$ : ${val}`));
source2$.subscribe(val => console.log(`sub2$ : ${val}`));

// call connect after 5 seconds, causing source to begin emitting items
setTimeout(() => {
  source2$.connect();
}, 5000);