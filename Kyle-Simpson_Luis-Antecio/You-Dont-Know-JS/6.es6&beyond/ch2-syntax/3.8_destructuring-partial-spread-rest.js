
function foo() {
  return [1, 2, 3];
}
function bar() {
  return { x: 4, y: 5, z: 6 };
}
{ // you do not have to assign all the values that are present.
  var [, b] = foo();
  var { x, z } = bar();
  // 1, 3 are discarded
  b;
  // 5 is discarded
  x;
  z;
}
{ // if you try to assign more values than are present, you get undefined (missing)
  var [,, c, d] = foo();
  var {w, z} = bar();

  c;
  d;
  z;
  w;
}

{ // you can use ... to spread values
  var a = [2, 3, 4];
  var b = [1, ...a, 5 ];
  b;
}
{ // you can use ... to gather values (rest)
  var a = [2, 3, 4];
  var [b, ...c] = a;
  b;
  c;
}