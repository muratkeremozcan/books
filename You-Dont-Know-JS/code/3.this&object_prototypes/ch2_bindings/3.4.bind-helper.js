function foo(something) {
  console.log( this.a, something );
  return this.a + something;
}

// old way: simple `bind` helper
function binder(fn, obj) {
  return function() {
      return fn.apply( obj, arguments );
  };
}

var obj = {
  a: 2
};

var bar = binder( foo, obj );

var b = bar( 3 ); // 2 3

