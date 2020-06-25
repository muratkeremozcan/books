import { of, } from 'rxjs';
import * as Rx from 'rxjs/Rx';

// leave the wonderful world of observables and go back to a more primitive state like 

let promise = of(1,2,3,4,5).toPromise();

promise.then(data => console.log('Promise', data));



// example 2

const example2$ = val => Rx.Observable.of(val).delay(5000);

const promise2 = example2$('2nd example').toPromise();


promise2.then(result => console.log(`example 2 result: ${result}`));


// example 3 Promise.all

/*
  convert each to promise and use Promise.all
  to wait for all to resolve
*/
const promiseAll = () => {
  return Promise.all([
    example2$('Promise 1').toPromise(),
    example2$('Promise 2').toPromise(),
  ]);
};

promiseAll().then(val => {
  console.log('Promise.all Result:', ...val);
});
