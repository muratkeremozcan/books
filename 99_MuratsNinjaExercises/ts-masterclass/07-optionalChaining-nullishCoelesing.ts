///// Optional chaining
interface ObjectA {
  m1?: ObjectB
}
interface ObjectB {
  m2?: ObjectC
}
interface ObjectC {
  m3: string
}

// old way
function print(o: ObjectA) {
  if (o.m1) {
    if (o.m1.m2) {
      return o.m1.m2.m3
    }
  }
}

const obj1: ObjectA = {
  m1: undefined,
}
const obj2: ObjectA = {
  m1: {
    m2: undefined,
  },
}
const obj3: ObjectA = {
  m1: {
    m2: {
      m3: 'Yeah!',
    },
  },
}
print(obj1) //?
print(obj2) //?
print(obj3) //?

// new way
function print2(o: ObjectA) {
  return o.m1?.m2?.m3
}
print2(obj1) //?
print2(obj2) //?
print2(obj3) //?

///// nullish coalescing
function getValue(): string | undefined {
  // if (Math.random() > 0.5) {
  //   return undefined
  // }
  // return 'Good'
  return Math.random() > 0.5 ? undefined : 'Good'
}
// randomly returns 'default' or 'Good'

// old way
let value = getValue()
if (!value) {
  value = 'default'
}
value //?

// using the || would be problematic with 0 '' false NaN
const value2 = getValue() || 'default'
value2 //?

// nullish coalescing will can be used instead
const value3 = getValue() ?? 'default'
value3 //?
