
{ // the assignment completion value is the full right-hand object/ array value.
  var o = { a: 1, b: 2, c:3 }, p;
  // p is assigned to o, not a, b, c
  p = {a, b, c} = o;
  a;
  b;
  c;
  p
  o
}
{ // the same is true for array destructuring
  var o = [1, 2, 3], p;

  p = {a, b, c} = o;
  p;
  o;
  a
  b
  c
}
{ // you can chain destructuring assignment expressions together
  var o = { a: 1, b: 2, c:3},
      p = [4, 5, 6],
      a, b, c, x, y, z;

  ( {a} = {b, c} = o );
  [x, y] = [z] =p;

  a;
  b;
  c;
  x;
  y;
  z;
}