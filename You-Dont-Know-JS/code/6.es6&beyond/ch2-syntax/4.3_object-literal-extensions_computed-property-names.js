// ES6 allows you to specify an expression that should be computed

var prefix = 'user'; 

var o = {
  baz: function () {return 'baz'},
  [ prefix + 'Foo' ]: function() {return 'foo function'},
  [ prefix + 'Bar' ]: function() {return 'bar function'},
  // (1) Probably the most common use of computed property names will be with Symbols
  [ Symbol.toStringTag ]: 'really cool thing'
};

o.baz(); //?
o.userFoo(); //?
o.userBar(); //?

// (2) Symbol.toStringTag is a special built-in value, which we evaluate with the [ .. ] syntax, 
// so we can assign the "really cool thing" value to the special property name.
o.toString(); //?