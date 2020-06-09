import Rx from 'rxjs/Rx';
import { test } from 'ramda';
const chai = require('chai');


// setup
let testScheduler = new Rx.TestScheduler(chai.assert.deepEqual);

const lhsMarble = '-a-b-c-|';

const expected = '-a-b-c-|';

const expectedMap = {
  x: 1,
  y: 2,
  z: 3
};

const lhs$ = testScheduler.createHotObservable(lhsMarble, { x: 1, y: 2, z: 3 });

const myAlgorithm = (lhs) =>
  Rx.Observable
    .from(lhs);

const actual$ = myAlgorithm(lhs$);

testScheduler.expectObservable(actual$).toBe(expected, expectedMap);
testScheduler.flush();


// marble tests
https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing
https://www.npmjs.com/package/jest-marbles