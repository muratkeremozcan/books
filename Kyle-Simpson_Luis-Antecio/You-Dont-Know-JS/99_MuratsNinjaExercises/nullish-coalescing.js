{
  // assigning a default value with ||
  let foo
  let someDummyText = foo || 'Hello'

  someDummyText
}

{
  // || is boolean, this brings up problems with 0 '' false NaN, only null undefined work as we would want

  let foo = 0
  let someDummyText = foo || 'Hello'

  // we want 0 but gives Hello
  someDummyText
}

{
  // nullish coalescing helps with valid falsy values we want to show: 0 '' false NaN
  let foo = 0

  let someDummyText = foo ?? 'Hello'

  someDummyText
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator

/////////

// https://dev.to/noriste/routemanager-ui-coding-patterns-generic-ones-4iaa Stefano's notes
const object = {
  foo: 0,
  bar: '',
  baz: false,
  qux: NaN,
  quux: undefined,
  corge: null,
}

{
  // ❌ don't
  function get(key) {
    return object[key] ? object[key] : '-'
  }
  // ✅ do
  function get2(key) {
    return object[key] ?? '-'
  }

  get('foo') //?
  get2('foo') //?

  get('bar') //?
  get2('bar') //?

  get('baz') //?
  get2('baz') //?

  get('qux') //?
  get2('qux') //?

  get('quux') //?
  get2('quux') //?

  get('corge') //?
  get2('corge') //?
}

// Nullish Coalescing assignment can be compressed by using the ??= operator.
{
  // ❌ don't
  object.foo = object.foo ?? {}
  object //?

  // ✅ do
  object.foo ??= {}
  object //?
}
