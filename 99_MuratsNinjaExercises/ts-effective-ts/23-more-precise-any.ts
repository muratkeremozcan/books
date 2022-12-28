// Prefer more precise forms of any such as any[] or {[id: string]: any} or () => any if they more accurately model your data.

// Don't do this!
function getLengthBad(array: any) {
  return array.length
}

// if you know it will be an array, do this
function getLength(array: any[]) {
  return array.length
}

// if you know it will be an object, do this
function hasTwelveLetterKey(o: {[key: string]: any}) {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key])
      return true
    }
  }
  return false
}
// the above is better than the object type, because you can't access the values of the object
function hasTwelveLetterKey2(o: object) {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key])
      //  ~~~~~~ Element implicitly has an 'any' type
      //         because type '{}' has no index signature
      return true
    }
  }
  return false
}

// you can make a function more precise
type Fn0 = () => any // any function callable with no params
type Fn1 = (arg: any) => any // With one param
type Fn2 = (...args: any[]) => any // With any number of params, same as "Function" type
type Fn3 = Function

const numArgsBad = (...args: any) => args.length // Returns any
const numArgsGood = (...args: any[]) => args.length // Returns number
