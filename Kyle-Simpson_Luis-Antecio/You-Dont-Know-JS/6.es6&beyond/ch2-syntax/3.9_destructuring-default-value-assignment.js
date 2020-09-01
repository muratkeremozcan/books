function foo() {
  return [1, 2, 3];
}
function bar() {
  return { x: 4, y: 5, z: 6 };
}

{ // you can use default value assignment ( array or object )
  var [ a = 3, b = 6, c = 9, d = 12 ] = foo();
  var { x = 5, y = 10, z = 15, w = 20 } = bar();

  a;
  b;
  c;
  d;

  x;
  y;
  z;
  w;
}

{ // you can combine the default value assignment with the alternative assignment expression syntax
  var {x, y, z, w: WW = 20} = bar();
  x;
  y;
  z;
  w;
  WW;
}

// destructuring is great and can be very useful, but it’s also a sharp sword that can cause injury (to someone’s brain) if used unwisely.
{ // do not overdo it and confuse : using an object or array as the default value in destructuring
  var x = 200, y = 300, z = 100;
  var o1 = { 
    x: { y: 42 }, 
    z: { y: z } 
  };

  ( { y: x = { y: y } } = o1 ); 
  ( { z: y = { y: z } } = o1 ); 
  ( { x: z = { y: x } } = o1 );
  x.y; //?
  y.y; //?
  z.y; //?
}