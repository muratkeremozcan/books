// (binding rule 1) default binding

// If strict mode is in effect, the global object is not eligible for the default binding, 
  // so the this is instead set to undefined:

function foo() {
  console.log(this.a);
}

// variables declared in the global scope, as var a = 2 is, 
  // are synonymous with global-object properties of the same name.
var a = 2;

foo(); // 2 if not strict mode
