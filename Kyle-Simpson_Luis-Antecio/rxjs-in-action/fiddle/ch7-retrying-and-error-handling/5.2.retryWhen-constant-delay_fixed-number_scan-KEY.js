import * as Rx from 'rxjs/Rx';

// You can also use retryWhen() to implement a fixed number of retries 
// by keeping track of the number of times the source observable has been retried, utilizing scan() operator


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) { // artificial error during pipeline
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retryWhen(error$ =>
    // scan operator is used to emit values every interval
    error$
      .scan((errorCount, err) => { // accumulator, val
        const maxRetries = 3;
        if (errorCount > maxRetries) {
          throw err;
        }
        return ++errorCount; // increase count by 1
      }, 1) // start accumulator from 1, for the original stream
      .delay(2000) // can intoduce a delay. It can go before the scan() as well
      
  )
  .catch(err => Rx.Observable.of(6)) // optionally, can still combo with catch
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
  )