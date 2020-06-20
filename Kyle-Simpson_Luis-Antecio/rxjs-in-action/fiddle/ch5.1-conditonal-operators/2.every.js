import { of, concat } from 'rxjs';
import { every, delay, tap } from 'rxjs/operators'; 

// If all values pass predicate before completion emit true, else false.
// every(predicate: function, thisArg: any): Observableimport { every } from 'rxjs/operators';

const oneToFive = of(1, 2, 3, 4, 5);

const example1 = oneToFive.pipe(
  every(val => val % 2 === 0) //is every value even?
);
// output: false
example1.subscribe(val => console.log(`is every value even? ${val}`));


const allEvens = of(2, 4, 6, 8, 10);

const example2 = allEvens.pipe(
  every(val => val % 2 === 0) //is every value even?
);

example2.subscribe(val => console.log(`is every value even? ${val}`));


// values arriving over time and completing stream prematurely due to every returning false
const log = console.log;

const returnCode = request => (Number.isInteger(request) ? 200 : 400);

const fakeRequest = request =>
  of(returnCode(request)).pipe(
    tap(_ => log(request)),
    delay(1000)
  );

const apiCalls$ = concat(
  fakeRequest(1),
  fakeRequest('invalid payload'),
  fakeRequest(2) //this won't execute as every will return false for previous line
).pipe(
  every(e => e === 200),
  tap(e => log(`all request successful: ${e}`))
);

apiCalls$.subscribe();