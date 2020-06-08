/**
 *  RxJS in Action
 *  Listing 9.9
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
mocha.setup({ ui: 'bdd', checkLeaks: true });

const expect = chai.expect;
const assert = chai.assert;

function square(x) {
  return x * x;
}

function assertDeepEqual(actual, expected) {
  expect(actual).to.deep.equal(expected);
}

describe('Map operator', function () {
  it('Should map multiple values', function () {
    // Creates an instance of the TestScheduler and passes the comparison function to use
    let scheduler = new Rx.TestScheduler(assertDeepEqual);

    // Creates a cold observable from the ASCII diagram
    let source = scheduler.createColdObservable(
      '--1--2--3--4--5--6--7--8--9--|');

    // Creates the assertion value placeholders
    let expected = '--a--b--c--d--e--f--g--h--i--|';

    // Source stream with square operation
    let r = source.map(square);

    // Uses the scheduler to wire expectations
    scheduler.expectObservable(r).toBe(expected,
      {
        'a': 1, 'b': 4, 'c': 9, 'd': 16, 'e': 25,
        'f': 36, 'g': 49, 'h': 64, 'i': 81
      });

    // Flushes the stream, which causes the cold observable to emit its values
    scheduler.flush();
  });
});

mocha.run();
