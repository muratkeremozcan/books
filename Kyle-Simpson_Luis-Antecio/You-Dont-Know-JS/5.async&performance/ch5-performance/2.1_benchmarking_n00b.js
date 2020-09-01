var start = (new Date()).getTime(); //?
var startAlt = Date.now(); //?

// do some operation
var j = 0;
for (var i = 0; i < 1E6; i ++) {
  j++;
}
console.log('hello', j);


var end = Date.now();

console.log(end - start);

// This is doing it benchmarking wrong

// Some platforms don’t have single millisecond precision

// You have near-zero confidence that it will always run at this speed - test it out!

// there may have been some other delay in getting either start or end timestamps.

// A straight mathematical average by itself is definitely not sufficient for making judgments about performance which you plan to extrapolate to the breadth of your entire application.

// You’ll also want to understand something about just how slow the worst sample is, how fast the best sample is, how far apart those best and worse cases were, and so on.

// You should use Benchmark.js.
