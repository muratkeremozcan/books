// concatMap(): map values to inner observable, subscribe and emit in order.
// signature: concatMap(project: function, resultSelector: function): Observable


// example: demonstrating the difference between concatMap and mergeMap
// Because concatMap does not subscribe to the next observable until the previous completes, 
// the value from the source delayed by 2000ms will be emitted first. 
// Contrast this with mergeMap which subscribes immediately to inner observables, 
// the observable with the lesser delay (1000ms) will emit, followed by the observable which takes 2000ms to complete.


import { of } from 'rxjs';
import { concatMap, delay, mergeMap } from 'rxjs/operators';

const source = of(2000, 1000);

// mergemap will intervleave without an order; first come first served
const mergeMapExample = source.pipe(
  mergeMap(
    val => of(`Delayed by: ${val}ms`).pipe(
      delay(val)
    )
  )
);

// concatMap will wait until the 1st observable complete
const concatMapExample = source.pipe(
  concatMap(
    val => of(`Delayed by: ${val}ms`).pipe(
      delay(val)
    )
  )
);


mergeMapExample.subscribe(val =>
  console.log(`with mergeMap ${val}`)
);

concatMapExample.subscribe(val =>
  console.log(`With concatMap: ${val}`)
);



// example: supplying a projection function

const source2 = of('Hello', 'Goodbye');

const examplePromise = val => new Promise(resolve => resolve(`${val} World!`));

// the result of the first parameter is passed to second parameter selector function before being  returned

const example2 = source2.pipe(
  concatMap(
    val => examplePromise(val),
    // remember the 2nd argument; the result selector function. First argument selects the 1st sequence, 
    // 2nd argument is the final result which is the same as if you left out the selector function
    (firstArg, secondArg) => `first argument is: ${firstArg}, second argument is : ${secondArg}`
  )
);

example2.subscribe(val =>
  console.log('Example w/ Selector:', val)
);