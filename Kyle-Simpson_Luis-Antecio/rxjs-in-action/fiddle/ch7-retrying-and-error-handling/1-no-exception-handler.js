import * as Rx from 'rxjs/Rx';

// at the end of an observable stream, subscriber implements 3 methods:
// next(), error(), complete()

// without exception hadlers mid-stream,
// errors that occur during the stream are propagated to the observer's error function


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) { // artificial error during pipeline
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .map(computeHalf)
  .subscribe(
    // because there is no way to recover, the first exception results in the stream being cancelled
    // only gets 1 and 2, not 4 and 5
    val => {
      console.log(val)
    },
    // the error is pushed down so that sidee effects can be observed (pop-up, modal, etc.)
    err => {
      console.log(`caught: ${err}`);
    },
    complete => {
      console.log('complete');
    }
  )