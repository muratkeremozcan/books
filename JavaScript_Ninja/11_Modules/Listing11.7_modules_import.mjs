// This is when you want to import certain vars and functions
// EX: export { message, sayHiToNinja };

// you can use either file to import from
// you need Node 10+ and need to have .mjs extensions
import { message, sayHiToNinja } from "./Listing11.6_modules_export_atTheEndOfModule.mjs";
// import { message, sayHiToNinja } from "./Listing11.5_modules_export_varFunctionClass.mjs";

console.log(message); // We can access the imported variable"
console.log(sayHiToNinja()); // we can access the imported function
console.log(typeof ninja); // we cannot access the internal variable
