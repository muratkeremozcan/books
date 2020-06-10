import R from 'ramda';
import * as Rx from 'rxjs/Rx';

// remember zip? Used in FP to merge 2 corresponding arrays

const records = R.zip (
  ['RecordA', 'RecordB', 'RecordC'],
  ['123', '456', '789'],
);
/*
[ [ 'RecordA', '123' ], 
  [ 'RecordB', '456' ], 
  [ 'RecordC', '789' ] 
] 
*/

// Zip also exists in RxJs, and is similar to combineLatest
// with the examption that it gets equal number of items from the arrays, ignores the excess

const s1$ = Rx.Observable.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
const s2$ = Rx.Observable.of('a', 'b', 'c', 'd', 'e',);

Rx.Observable.combineLatest(s1$, s2$); //?
Rx.Observable.zip(s1$, s2$); //?

// The zip() operator can be very useful in cases when you need to spread out a stream synchronously over time,
// It’s not recommended when coordinating asynchronous streams that emit at different times—combineLatest() is the operator of choice in these cases.
