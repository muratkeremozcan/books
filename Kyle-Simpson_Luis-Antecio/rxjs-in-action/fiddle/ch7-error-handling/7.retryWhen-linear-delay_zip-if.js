import Rx from 'rxjs/Rx';

// retryWhen with linear delay
// the stream will attempt to run for a fixed number of times (given by maxRetries), 
// with a linearly incrementing time of 1 second between retries, before finally giving up.

// zip() pairs the events one-to-one, so it’s effective when the asynchronous streams it’s operating over 
// emit values with similar time intervals, which you can’t control all of the time. For that, use combineLatest


const computeHalf = x => Math.floor(x / 2);
let maxRetries = 3;

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) {
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retryWhen(errors$ =>
    // Returns an observable that will emit a maxRetries number of events. 
    // So, if maxRetries is 3, it will emit events 3 - 0 = 3 times.
    Rx.Observable
      .range(0, maxRetries + 1)
      // zip is used to combine one-to-one values from the source observable (range) with the error observable. 
      // You pass a selector/idenity function, that combines events from both zipped streams into a single object
      .zip(errors$, (i, err) => ({ 'i': i, 'err': err }))

      // mergeMaps with a timer observable based on the number of attempts. 
      // This is what allows you to emulate the liner delay backoff mechanism.
      .mergeMap(({ i, err }) => { // destructures the parameter to extract the attempt count and the last error object that occurred

        // signal the unrecoverable condition on your last retry action

        //   // because this code is inside a mergeMap() operator, it expects you to return an observable object
        //   if (i === maxRetries) {
        //     return Rx.Observable.throw(err);  //#C
        //   }
        //   return Rx.Observable.timer(i * 1000)
        //     .do(() =>
        //       console.log(`Retrying after ${i} second(s)...`));
        // })


        // instead of conditional, use the RxJS if operator: Rx.Observable.if(() => condition, then$, else$)
        // if() operator (also called the functional combinator) select between two streams based on the condition

        return Rx.Observable.if(
          () => i <= maxRetries - 1,
          Rx.Observable.timer(i * 1000)
            .do(() =>
              console.log(`Retrying after ${i} second(s)...`)),
          Rx.Observable.throw(err)
        )
      })
  )
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


