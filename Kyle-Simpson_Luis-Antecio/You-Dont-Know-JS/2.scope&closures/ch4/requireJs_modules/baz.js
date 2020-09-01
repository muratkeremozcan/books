const {hello, howAreYou} = require('./bar'); // similar enough to ES6 import with destructuring
// or you can do method referencing, which is not as nice
// const hello = require('./bar').hello;
// const howAreYou = require('./bar').howAreYou;
const barAlias = require('./bar');
const awesome = require('./foo'); // importing default function seems similar

console.log(hello('rhino'));
console.log(howAreYou());

barAlias.hello('rhino'); //?
barAlias.howAreYou(); //?

awesome(); //?



  /*
    // basically there are 3 ways to REQUIRE exports, the rest are combinations of these
    const { functionName } = require('module')
    const someAlias = require('module')

    // if the export default was used
    const functionName = require('module')

  */