import { timer } from 'rxjs';
import { tap, mapTo, share } from 'rxjs/operators';

// Share source among multiple subscribers
// signature: share(): Observable

const source1$ = timer(1000);

const source2$ = source1$.pipe(
  tap(() => console.log('***SIDE EFFECT***')),
  mapTo('***RESULT***') // do nothing until connect() is called
);

source2$.subscribe(val => console.log(val));
source2$.subscribe(val => console.log(val));
/*
  ***NOT SHARED, SIDE EFFECT WILL BE EXECUTED TWICE***
  output:
  "***SIDE EFFECT***"
  "***RESULT***"
  "***SIDE EFFECT***"
  "***RESULT***"
*/

// share observable among subscribers
const sharedSource$ = source2$.pipe(share());

// When the number of observers subscribed to a shared observable goes from 0 to 1, you connect to the underlying observable sequence.
sharedSource$.subscribe(val => console.log(val));
// When the second subscriber is added, no additional subscriptions are added to the underlying observable sequence.
sharedSource$.subscribe(val => console.log(val));
/*
  ***SHARED, SIDE EFFECT EXECUTED ONCE***
  output:
  "***SIDE EFFECT***"
  "***RESULT***"
  "***RESULT***"
*/