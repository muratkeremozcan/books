{ // source property can be listed multiple times
  var { a: X, a: Y } = { a: 1 };
  X; //?
  Y; //?
}

{ // you can destruct sub-object/sub-array property and capture the sub-object/sub-array's value
  var {
    a: {
      x: X,
      x: Y
    },
    a
  } = {
    a: {
      x: 1
    }
  };

  X;
  Y;
  a;
}

{
  (
    {
      a: X,
      a: Y,
      a: [Z]
    } = {
      a: [1]
    }
  );

  X;
  Y;
  Z;

  Y[0] = 10;
  X;
  X;
  Z;
}
