https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

// this Import an entire module for side effects only, without importing anything. 
  // it runs the module's global code, but doesn't actually import any values.
// import './foo';
// import './bar';

// to import a module fully, you have to assign the imported module to a module object which is used as a namespace

import * as foo from './foo';
import * as bar from './bar';

console.log(bar.hello('rhino'));

foo.awesome(); //?
