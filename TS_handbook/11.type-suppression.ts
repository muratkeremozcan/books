var foo = 123;
var bar = 'hey';

bar = foo as any; // suppressed



function baz(): any { // suppressed
  return 1;
}
bar = baz(); 


// ell maintained and strongly typed definitions for nearly the top 90% JavaScript libraries out there exists in an OSS Repository called
// https://github.com/DefinitelyTyped/DefinitelyTyped
// npm install @types/jquery --save-dev
/*  
you can choose to explicitly only bring in the types that make sense using the tsconfig.json
where only jquery will be allowed to be used. 
Even if the person installs another definition like npm install @types/node its globals (e.g. process)
will not leak into your code until you add them to the tsconfig.json types option.
{
  "compilerOptions": {
      "types" : [
          "jquery"
      ]
  }
} 
*/
// if this does not work, you can do things like

// jquery
declare var $: any;
// or
declare type JQuery = any;
declare var $: JQuery;

// Similar to global variable declaration you can declare a global module quite easily
declare module "jquery";
import * as $ from "jquery";

// you can allow import of any file
declare module "*.css";
import * as foo from "./some/file.css";
declare module "*.html";