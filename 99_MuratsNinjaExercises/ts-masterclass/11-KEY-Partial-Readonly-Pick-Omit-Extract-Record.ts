////// Mapped Types
//// Partial :  take the same properties as T, but all of them are optional.
//// Readonly : you can't modify the properties of the original type

type Person = {
  name: string
  age: number
  address: string
}

type PersonPartial = Partial<Person>
type ReadonlyPerson = Readonly<Person>

const person: Person = {
  name: 'John',
  age: 30,
  address: '123 Main St',
}
const personPartial: PersonPartial = {
  name: 'John',
  age: 30,
  // having less properties is allowed
}

const personReadonly: ReadonlyPerson = {
  name: 'John',
  age: 30,
  address: '123 Main St',
}
// personReadonly.name = 'Jane' // error

//////// Pick
// extending interfaces via inheritence is good
interface Animal {
  age: number
  gender: string
  name: string
}
interface Fish extends Animal {
  maximumDeepness: number
}
interface Feline extends Animal {
  numberOfLegs: number
  canSwim: boolean
  runningSpeed: number
}

///////// Pick
// sometimes you need to create a dynamic type, that's when you need Pick
type WildCat = Pick<Feline, 'age' | 'name' | 'runningSpeed'>

function buyACheetah(cheetah: WildCat) {
  return cheetah
}
buyACheetah({age: 1, name: 'Cheetah', runningSpeed: 100}) //?

////// Omit - opposite of Pick
type CatDontSwim = Omit<Feline, 'canSwim'>
function buyACat(cat: CatDontSwim) {
  return cat
}
buyACat({
  age: 1,
  name: 'Cat',
  numberOfLegs: 4,
  runningSpeed: 100,
  gender: 'female',
}) //?

////////// Record
// Record is a generic type that takes two types as parameters <key, value>
// K representing property names in the resulting type,
// T representing the type of values of these properties.

function receiveInput(dataIn: Record<keyof Feline, string>): Feline {
  return {
    age: parseInt(dataIn.age),
    name: dataIn.name,
    numberOfLegs: parseInt(dataIn.numberOfLegs),
    canSwim: dataIn.canSwim === 'true',
    runningSpeed: parseInt(dataIn.runningSpeed),
    gender: dataIn.gender,
  }
}
// suppose we get some JSON, it's all string values, but we want the types of a Feline at the end
const dataIn = {
  age: '1',
  name: 'Cat',
  numberOfLegs: '4',
  canSwim: 'true',
  runningSpeed: '100',
  gender: 'male',
}

receiveInput(dataIn) //?

////// Extract : takes 2 types and returns a type that is the intersection of the 2 types
// we have Animal interface above, let's say we have Human too
interface Human {
  age: number
  gender: string
  consciousness: boolean
}

// only age and gender will be common
type LivingThing = Extract<keyof Animal, keyof Human>

// we can combine Extract with Record to build a new type that's the intersection of the 2 types
function howOld(what: Record<LivingThing, number | string>) {
  return what.age
}

const animal: Animal = {name: 'Lion', age: 5, gender: 'female'}
const human: Human = {age: 10, consciousness: true, gender: 'female'}
howOld(human) //?
howOld(animal) //?

///// Exclude : how is it different than Omit? Omit specifies properties to leave out,
// Exclude takes a type T, and removes the members that are assignable to U.

type Conscious = Exclude<keyof Human, keyof Animal> // only consciousness is not assignable to Animal

function isConscious(what: Record<Conscious, string | boolean>) {
  return what.consciousness
}
isConscious(human) //?

/// other examples
type MyExclude<T, U> = T extends U ? never : T
type AB = Exclude<'A' | 'B' | 'C', 'C'> // 'A' | 'B'
type SomeNumbers = MyExclude<'A' | 'B' | 1 | 2, string> // 1 | 2

////// ReturnType : makes it easy to reference the return type of a function

function getSomething() {
  if (Math.random() < 0.5) {
    return {
      cond: 'under 0.5',
      typeScript: true,
    }
  } else {
    return {
      cond: 1,
      typeScript: '3.7',
      moreField: true,
    }
  }
}
type functionType = ReturnType<typeof getSomething>

// ReturnType with promises
async function asyncFunction() {
  return await Math.random()
}
type functionType2 = ReturnType<typeof asyncFunction> // Promise<number>
type ReturnTypeFromPromise<T> = T extends Promise<infer U> ? U : T // conditional type
type functionType3 = ReturnTypeFromPromise<functionType2> // number

////// Parameters : makes it easy to reference the parameters of a function

const sayHello = (name: string, age: number) =>
  `Hello ${name}, your age is ${age}`
type SayHelloParams = Parameters<typeof sayHello> // [string, number]
