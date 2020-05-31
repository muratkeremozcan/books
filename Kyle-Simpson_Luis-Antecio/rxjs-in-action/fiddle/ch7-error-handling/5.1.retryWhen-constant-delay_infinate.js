import Rx from 'rxjs/Rx';

// retryWhen() - back-off strategy: the goal is to not overload the server with retries
// 4 different back-off strategies: constant, linear, exponential, jitter (random)

// constant delay example here

const computeHalf = x => Math.floor(x / 2);

Rx.Observable.of(2,4,5,8,10)
  .map(num => {
    if(num % 2 !== 0) { // artificial error during pipeline
      throw new Error(`odd number: ${num}`);
    }
    return num;
  })
  // using the delay operator, can retry every (constant) period
  // the problem is that it goes on forever
  .retryWhen(error$ => error$.delay(3000))
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