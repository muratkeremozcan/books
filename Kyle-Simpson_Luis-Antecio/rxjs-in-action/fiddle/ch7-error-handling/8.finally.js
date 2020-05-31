import Rx from 'rxjs/Rx';

// try, catch, finally analogy]
// finally() invokes a specified void function after the source observable terminates by invoking the observer’s complete() or error() methods. 
// So the expectation is that finally() could perform some kind of side effect, if need be, such as cleanup actions.


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) {
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  .retry(3) // you want to retry before the catch, and catch s last resort
  .catch(err => Rx.Observable.of(6))
  .map(computeHalf)
  .finally(() => {
    console.log('done done');
    // or for example you could have an unsubscribe in the event an error occurs
  })
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


  // check out 7.9 for a complex example
  // the only addition to the previous example is catch() and finally()