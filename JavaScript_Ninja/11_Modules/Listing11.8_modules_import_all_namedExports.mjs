// This is when you want to import things and use an object.property notation
// EX: export { message, sayHiToNinja };

import * as ninjaModule from "./Listing11.6_modules_export_atTheEndOfModule.mjs";
// using * (everything exported) as ninjaModule

// we can access the exported identifiers through property notation
console.log(ninjaModule.message);
console.log(ninjaModule.sayHiToNinja());
console.log(ninjaModule.ninjas); // no access