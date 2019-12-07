// the only requirement for these is the left hand side: to match in naming

{ // You can use the general assignments to create object mappings/ transformations,
  var o1 = { a: 1, b: 2, c: 3 },
    o2 = {};

  ({ a: o2.x, b: o2.y, c: o2.z } = o1);
  o2.x; //?
  o2.y; //?
  o2.z; //?
}


{ // can map an object to an array
  var o1 = { a: 1, b: 2, c: 3 },
    a2 = [];

  ({ a: a2[0], b: a2[1], c: a2[2] } = o1);

  a2; //?
}


{ // map an array into an object
  var a1 = [1, 2, 3],
    o2 = {};

 [o2.a, o2.b, o2.c] = a1;
 o2.a; //?
 o2.b; //?
 o2.c; //?
}

{ // trivia: you can even solve the traditional “swap two variables” task without a temporary variable:
  var x = 10, y = 20;

  [y, x] = [x, y]; 
  x;
  y;
}