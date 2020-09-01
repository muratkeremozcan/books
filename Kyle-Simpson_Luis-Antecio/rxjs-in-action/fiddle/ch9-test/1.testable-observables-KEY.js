import * as Rx from 'rxjs/Rx';



// to make code more testable, separate Observable, pipeline and observer

// create a function for the pipeline/business logic
// pass the Observable as an argument to this function
// the observer becomes the test assertions

/*
Rx.Observable.interval(1000) // the Observable/source
  .take(10) // the pipeline
  .filter(num => num % 2 === 0)
  .map(num => num * num)
  .reduce((total, delta) => total + delta)
  .subscribe(console.log); // the observer
*/

const isEven = num => num % 2 === 0;
const square = num => num * num;
const add = (a, b) => a + b;

// take the pipeline out, wrap it in a function, pass the source as the argument to this function
// source passed as an arg, pipeline is the body of the function, and no subscribe here
const runInterval = source$ =>
  source$
    .take(10)
    .filter(isEven)
    .map(square)
    .reduce(add);


// call the stream from within your test, provide a producer into it, and place your assertions into the subscribe block:

/*
it('Should square and add even numbers', function (done) {
  this.timeout(20000); // increase the mocha timeout (2 seconds) to allow the stream to complete

  runInterval(Rx.Observable.interval(1000))
    .subscribe({  // the asssertions are decoupled from the stream code
      next: total => expect(total).to.equal(120),
      err: err => assert.fail(err.message),
      complete: done
    });
  });

*/