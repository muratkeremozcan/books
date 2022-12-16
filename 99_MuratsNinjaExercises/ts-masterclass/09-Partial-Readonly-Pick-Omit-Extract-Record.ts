////// Mapped Types
// With Partial you can have less of the properties of the original type
// With Readonly you can't modify the properties of the original type

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

// and sometimes you need to create a dynamic type, that's when you need Pick
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
// used to create a type that maps keys to values.
// Useful when getting data from an API, and you need to map it to a type

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
// suppose we get some JSON, it's all strings, but we want a Feline at the end
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

///// Exclude : how is it different than Omit? Omit specifies properties to leave out, Exclude gets rid of the non-common properties
type SomeThingsName = Exclude<keyof Animal, keyof Human> // only name is common

function whatName(what: Record<SomeThingsName, string | boolean>) {
  return what.name
}
whatName(animal) //?

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

///////// custom types
// NonNullable
// if it extends null or undefined, should never happen, otherwise return the type
type NonNullValue<T> = T extends null | undefined ? never : T

function print<T>(p: NonNullValue<T>): void {
  console.log(p)
}

print('Test') // Compile
// print(null); // Does not compile

/// Adding a property conditionally
interface Persona {
  name: string
  dateCreated: Date
}
interface Animala {
  name: string
}

// if dateCreated exists in the type, add a new property modifiedDate
type Modified<T> = T extends {dateCreated: Date}
  ? T & {modifiedDate: Date}
  : never

const pp: Persona = {name: 'Pat', dateCreated: new Date()}
const aa: Animala = {name: 'Jack'}

const persona: Modified<Persona> = {...pp, modifiedDate: new Date()}
// const animala: Modified<Animala> = {...aa, modifiedDate: new Date()} // error
