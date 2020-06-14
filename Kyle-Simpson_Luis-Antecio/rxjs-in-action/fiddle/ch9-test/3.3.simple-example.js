import * as Rx from 'rxjs/Rx';
const chai = require('chai');


// setup
let testScheduler = new Rx.TestScheduler(chai.assert.deepEqual);
const lhsMarble = '-x-y-z';
const expected = '---y-';
const expectedMap = {
  x: 1,
  y: 2,
  z: 3
};

const lhs$ = testScheduler.createHotObservable(lhsMarble, { x: 1, y: 2, z: 3 });


const myAlgorithm = lhs =>
  Rx.Observable
    .from(lhs)
    .filter(x => x % 2 === 0);

const actual$ = myAlgorithm(lhs$);

// assert
testScheduler.expectObservable(actual$).toBe(expected, expectedMap);
// run the test
testScheduler.flush();