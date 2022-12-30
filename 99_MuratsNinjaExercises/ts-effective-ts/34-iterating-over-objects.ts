import R from 'ramda'
import _ from 'lodash'

// Use let k: keyof T and a for-in loop to iterate objects when you know exactly what the keys will be.
/// Be aware that any objects your function receives as parameters might have additional keys.
// Use Object.entries to iterate over the keys and values of any object.

// use   let k: keyof typeof obj  to get the type of the keys of an object
{
  const obj = {
    one: 'uno',
    two: 'dos',
    three: 'tres',
  }
  for (const k in obj) {
    const v = obj[k]
    // ~~~~~~ Element implicitly has an 'any' type
    //        because type ... has no index signature
  }

  let k: keyof typeof obj // Type is "one" | "two" | "three"
  for (k in obj) {
    const v = obj[k] // OK
  }
}

// you can use Object.entries to convert an object to an array of key-value pairs
// either way, you have to use as keyof typeof obj to get the type of the keys of an object
{
  interface ABC {
    a: string
    b: string
    c: number
  }

  function foo(abc: ABC) {
    for (const k in abc) {
      // const k: string
      k //?
      const v = abc[k] //?
      // ~~~~~~ Element implicitly has an 'any' type
      //        because type 'ABC' has no index signature

      abc[k as keyof ABC] //?
    }
  }

  foo({a: 'a', b: 'b', c: 1})
}

{
  interface ABC {
    a: string
    b: string
    c: number
  }
  function foo(abc: ABC) {
    for (const [k, v] of Object.entries(abc)) {
      // k // Type is string
      // v // Type is any
      // const v = abc[k]
      k //?
      const v = abc[k as keyof ABC] //?
    }
  }

  foo({a: 'a', b: 'b', c: 1})

  // I'd use map
  function bar(abc: ABC) {
    Object.entries(abc).map(([k, v]) => {
      k //?
      v //?
    })
  }
  bar({a: 'a', b: 'b', c: 1})

  // better with lodash, because it iterates over an object
  function baz(abc: ABC) {
    _.map(abc, (v, k) => {
      k //?
      v //?
    })
  }
  baz({a: 'a', b: 'b', c: 1})

  // ramda map iterates over an array
  function qux(abc: ABC) {
    R.map(([k, v]) => {
      k //?
      v //?
    }, Object.entries(abc))
  }
  qux({a: 'a', b: 'b', c: 1})
}
