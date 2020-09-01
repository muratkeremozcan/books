import * as Rx from 'rxjs/Rx';
import { test } from 'ramda';
const chai = require('chai');


// setup
let testScheduler = new Rx.TestScheduler(chai.assert.deepEqual);

const lhsMarble = '-#';

const expected = '#';

const expectedMap = {};

// we will simulate an error, so comment this out
// const lhs$ = testScheduler.createHotObservable(lhsMarble, { x: 1, y: 2, z :3 });

const myAlgorithm = lhs =>
  Rx.Observable
    .from(lhs)


const actual$ = myAlgorithm(Rx.Observable.throw('error')); // throw = throwErro


// assert
testScheduler.expectObservable(actual$).toBe(expected, expectedMap);

testScheduler.flush();