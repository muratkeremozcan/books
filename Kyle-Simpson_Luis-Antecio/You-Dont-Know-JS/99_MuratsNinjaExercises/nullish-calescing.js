{
  // assigning a default value with ||
  let foo;
  let someDummyText = foo || "Hello";

  someDummyText;
}

{
  // || is boolean, this brings up problems with 0 '' false NaN, only null undefined work as we would want

  let foo = 0;
  let someDummyText = foo || "Hello";

  // we want 0 but gives Hello
  someDummyText;
}

{
  // nullish coalescing helps with valid falsy values we want to show: 0 '' false NaN
  let foo = 0;

  let someDummyText = foo ?? "Hello";

  someDummyText;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
