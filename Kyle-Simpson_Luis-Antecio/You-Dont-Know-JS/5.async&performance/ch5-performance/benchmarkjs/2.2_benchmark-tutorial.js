// BenchmarkJS handles the complexities of setting up a fair, reliable, and valid performance benchmark  for a given piece of JavaScript code. 
// If you’re going to try to test and benchmark your code, this library is the first place you should turn.

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp test function', function () {
  /o/.test('Hello World!');
})
  .add('String indexOf function', function () {
    'Hello World!'.indexOf('o') > -1;
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });
