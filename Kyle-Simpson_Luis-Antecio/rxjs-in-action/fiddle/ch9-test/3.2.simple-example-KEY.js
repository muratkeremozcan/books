import * as Rx from 'rxjs/Rx';
const chai = require('chai');


// setup
let testScheduler = new Rx.TestScheduler(chai.assert.deepEqual);

// create a pattern instruction to the method createHotObservable(), which exists on testScheduler
const lhsMarble = '-x-y-z';

const expected = '-x-y-z';

const expectedMap = {
  x: 1,
  y: 2,
  z: 3
};

const lhs$ = testScheduler.createHotObservable(lhsMarble, { x: 1, y: 2, z: 3 });
/* corresponds to:
let stream$ = Rx.Observable.create(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
})
*/


const myAlgorithm = (lhs) =>
  Rx.Observable
    .from(lhs);

const actual$ = myAlgorithm(lhs$);

// assert: compare actual$ to the expected
// the data happened on the correct time frame and that the value on that frame is correct.
testScheduler.expectObservable(actual$).toBe(expected, expectedMap);


// to make the test run we need to flush it so that TestScheduler internally can trigger the HotObservable and run an assert
testScheduler.flush();