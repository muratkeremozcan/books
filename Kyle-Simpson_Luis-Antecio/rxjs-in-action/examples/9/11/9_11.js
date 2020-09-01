/**
 *  RxJS in Action
 *  Listing 9.11
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true });

const expect = chai.expect;
const assert = chai.assert;

function assertDeepEqual(actual, expected) {
  expect(actual).to.deep.equal(expected);
}

const isEven = num => num % 2 === 0;
const square = num => num * num;
const add = (a, b) => a + b;

const runInterval = (source$) =>
  source$
    .take(10)
    .filter(isEven)
    .map(square)
    .reduce(add);


it('Should square and add even numbers', function () {
  let scheduler = new Rx.TestScheduler(assertDeepEqual);

  //  Creates an observable that emits values every unit of time (10 ms)
  let source = scheduler.createColdObservable(
    '-1-2-3-4-5-6-7-8-9-|');

  //  The expected output is a stream with a single result at the end, given by the reduce operation.
  let expected = '-------------------(s-|';

  let r = runInterval(source);

  scheduler.expectObservable(r).toBe(expected, { 's': 120 });

  scheduler.flush();
});

mocha.run();
