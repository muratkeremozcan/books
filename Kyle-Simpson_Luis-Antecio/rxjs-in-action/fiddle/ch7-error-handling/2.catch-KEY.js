import * as Rx from 'rxjs/Rx';

// RxJs provides catch() operator in order to recover from mid-stream errors 
// catch() allows you to insert a default value in place of the event that caused the error; 
// any subsequent operators in the chain will never know that an exception occurred.


const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2, 4, 5, 8, 10)
  .map(num => {
    if (num % 2 !== 0) { // artificial error during pipeline
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  // you want to place the catch close to the code that might fail
  .catch(err => Rx.Observable.of(6)) // in the return you have to provide an Observable, Promise, Array, or Iterable
  .map(computeHalf)
  .subscribe(
    val => { // in case of an error, the catch operator provided value is passed down the stream
      console.log(val)
    },
    err => { // there are no side-effect errors, the code is reslient
      console.log(`caught: ${err}`);
    },
    complete => { // and can complete
      console.log('complete');
    }
  )