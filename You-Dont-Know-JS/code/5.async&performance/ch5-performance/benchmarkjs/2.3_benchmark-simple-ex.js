var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

function foo() {
  var j = 0;
  for (var i = 0; i < 1E6; i++) {
    j++;
  }
  return j
}

function bar() {
  var j = 0;
  for (var i = 0; i < 1E5; i++) {
    j++;
  }
  return j
}

suite
  .add('foo function', () => foo() )
  .add('bar function', () => bar() )
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });

