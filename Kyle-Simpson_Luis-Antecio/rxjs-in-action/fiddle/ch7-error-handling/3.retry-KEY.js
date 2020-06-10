import * as Rx from 'rxjs/Rx';

// catch let's you recover from errors with an alternate path, but stops the stream
// what if you want the stream to retry?
// retry() operator combines the notion of catching and reexecuting the source observable into one function


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) {
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retry(3) // how many times to retry (original run + amount to retry = 4)
  .map(computeHalf)
  .subscribe(
    val => { // in case of an error, the rety happens as many times as specified
      console.log(val)
    },
    err => { // if there are side effects, they will be observed by the observer after the retries are done
      console.log(`caught: ${err}`);
    },
    complete => { // does not complete
      console.log('complete');
    }
  )