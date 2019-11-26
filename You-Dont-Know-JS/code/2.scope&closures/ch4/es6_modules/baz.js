import { hello, howAreYou } from './bar'; // importing named function
import * as barAlias from './bar';
import awesome from './foo'; // importing default function

console.log(hello('rhino'));
console.log(howAreYou());

barAlias.hello('rhino'); //?
barAlias.howAreYou(); //?

// outputs HUNGRY HIPPO
awesome(); //? 



/*
  // basically there are 3 ways to import modules, the rest are combinations of these
  import { functionName } from 'module'
  import * as alias from 'module'

  // if the export default was used
  import functionName from 'module'

*/

  // Function-based modules aren’t a statically recognized pattern (something the compiler knows about), 
  // so their API semantics aren’t considered until runtime. 
  //  That is, you can actually modify a module’s API during the runtime

// By contrast, ES6 module APIs are static (the APIs don’t change at runtime). Since the compiler knows that, 
  // it can (and does!) check during (file loading and) compilation that a reference to 
  // a member of an imported module’s API actually exists.


  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import