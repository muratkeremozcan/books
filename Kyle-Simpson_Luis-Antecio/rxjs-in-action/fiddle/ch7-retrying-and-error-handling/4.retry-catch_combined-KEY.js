import * as Rx from 'rxjs/Rx';

// combine retry and catch


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) {
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retry(3) // you want to retry before the catch, and catch as the last resort
  .catch(err => Rx.Observable.of(6)) 
  // you can insert a finally() here to add something on top of the observer's error or complete callbacks
  .map(computeHalf)
  .subscribe(
    val => { // in case of an error, the rety happens original + retry amount (4)
      // and then catch() takes effect
      console.log(val)
    },
    err => { // no side effects because of catch
      console.log(`caught: ${err}`);
    },
    complete => { // and can complete
      console.log('complete');
    }
  )