import * as Rx from 'rxjs/Rx';
import moment from 'moment';

// replay vs resubscribe is about whether if the pipeline gets re-executed or not when another observer starts listening.
// replay is usually problem-free; the output emitted by an observable sequence is broadcast to all subscribers, pipeline runs every time
// if there are side effects involved, there will be problems
// in resubscribe, the pipeline may not re-reun. If the operator sequence has side effects, then new subscribers could see different results.

// replay with a hot observable can be a problem. (replay with cold would be ok)

// here the promise pipeline still runs, but because it's a hot observable (because of time), we have a problem
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    let isAfter5am = moment().hour() >= 5;
    if (isAfter5am) {
      reject(new Error('too late!'));
    }
    else {
      resolve('Success');
    }
  }, 5000);
});


const promise$ = Rx.Observable.fromPromise(p);

promise$.subscribe(val => console.log(`Sub1 ${val}`));
// assume we subscribe again later in the day (just toggle line 10), it would reject the promise
