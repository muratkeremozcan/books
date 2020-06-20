import * as Rx from 'rxjs/Rx';

// remember 4 different back-off strategies: constant, linear, exponential, jitter (random)
// retryWhen with linear delay:
// the stream will attempt to run for a fixed number of times (given by maxRetries), 
// with a linearly incrementing time of 1 second between retries, before finally giving up.

// zip(): After all observables emit, emit values as an array

const computeHalf = x => Math.floor(x / 2);
let maxRetries = 4;
/** with iteratio starting 0 and provided initial interval of 1000 milliseconds the emitted values would be 1000, 2000, 4000, 8000 */
const calculateDelay = (iteration, initialInterval) =>  Math.pow(2, iteration) * initialInterval;


Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) {
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retryWhen(errors$ =>
    // Returns an observable that will emit a maxRetries number of events. 
    // So, if maxRetries is 4, it will emit events 4 - 0 = 4 times.
    Rx.Observable
      .range(0, maxRetries + 1)
      // zip is used to combine one-to-one values from the source observable (range) with the error observable. 
      // You pass a selector/idenity function, that combines events from both zipped streams into a single object
      .zip(errors$, (i, err) => ({ 'i': i, 'err': err }))

      // mergeMaps with a timer observable based on the number of attempts. 
      // This is what allows you to emulate the linear delay backoff mechanism.
      .mergeMap(({ i, err }) => { // destructures the parameter to extract the attempt count and the last error object that occurred

        // signal the unrecoverable condition on your last retry action

        //   // because this code is inside a mergeMap() operator, it expects you to return an observable object
        //   if (i === maxRetries) {
        //     return Rx.Observable.throw(err);
        //   }
        //   return Rx.Observable.timer(i * 1000)
        //     .do(() =>
        //       console.log(`Retrying after ${i} second(s)...`));
        // })


        // instead of conditional, use the RxJS if operator: Rx.Observable.if(() => condition, then$, else$)
        // if() operator (also called the functional combinator) select between two streams based on the condition

        return Rx.Observable.if(
          () => i < maxRetries,
          // to make it exponential instead of linear, just use Math.pow(2, i) - or 3, or 4 - instead of i 
          Rx.Observable.timer(i * 1000)
            .do(() =>
              console.log(`Retrying after ${i} second(s)...`)), // of course, replace the iterator with the exponential function in the output
          Rx.Observable.throw(err)
        )
      })
  )
  // remember you can still combo with catch here
  // also you can insert a finally() here to add something on top of the observer's error or complete callbacks
  .map(computeHalf)
  .subscribe(
    val => {
      console.log(val)
    },
    err => {
      console.log(`caught: ${err}`);
    },
    complete => {
      console.log('complete');
    }
  );


