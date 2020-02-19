// this keyword is problematic for FPers
// the approach is to create an interface function that forces the this-using function to use a predictable this context

var ids = {
  prefix: "_",
  generate() {
    return this.prefix + Math.random();
  }
};

// this context here is the call site (global scope) which is dangerous
ids.generate(); //?

// we create an interface function that forces generate to use a predictable this context
function safer_generate(context) {
  return ids.generate.call(context);
}

safer_generate({prefix: "foo_"}); //?

// Essentially, we’re not really eliminating side causes/ effects, but rather containing and limiting them, 
// so that more of our code is verifiable and reliable.
