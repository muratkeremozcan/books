// serial flow control example with Async tool. It is longer but more organized than the crude method
/** http://caolan.github.io/async/
 * Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript
 * Async provides around 70 functions that include the usual 'functional' suspects (map, reduce, filter, each…)
 */
const async = require('async');
async.series([ // .series provides an array of functions for Async to execute, one after the other
  callback1 => {
    setTimeout( () => {
      console.log('With Async tool. I execute first');
      callback1();
    }, 1000);
  },
  callback2 => {
    setTimeout( () => {
      console.log('With Async tool. I execute second');
      callback2();
    }, 500);
  },
  callback3 => {
    setTimeout( () => {
      console.log('With Async tool. I execute third');
      callback3();
    }, 100);
  }
]);

setTimeout( () => {
  console.log('Crude method. I execute first');
  setTimeout( () => {
    console.log('Crude method. I execute second');
    setTimeout( () => {
      console.log('Crude method. I execute third');
    }, 200);
  }, 1000);
}, 2000);