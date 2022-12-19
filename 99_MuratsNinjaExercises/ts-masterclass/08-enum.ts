// unless assigned a value,the values start from 0 and increment
enum MyEnum {
  ChoiceA,
  ChoiceB,
  ChoiceC = 15,
  ChoiceD,
  ChoiceE = 'you can mix types',
}
enum MyEnum2 {
  ChoiceA, // 0
  ChoiceB = 100, // 100
  ChoiceC, // 101
  ChoiceD = MyEnum.ChoiceC, // you use computed values
}
MyEnum.ChoiceA //?
MyEnum.ChoiceB //?
MyEnum.ChoiceC //?
MyEnum.ChoiceD //?
MyEnum.ChoiceE //?

MyEnum2.ChoiceA //?
MyEnum2.ChoiceB //?
MyEnum2.ChoiceC //?
MyEnum2.ChoiceD //?

/////// bitwise enum
// enum is a good candidate for bitwise operations since the value can be explicitly set
// You can use the bit shift operator (<<) to set the value of an enum.
// Once defined, you can use it as any variable to determine if it contains the one you need
// or use the ampersand (&) to check if the one you want is present.
// The pipe symbol (|) lets you add many enum choices to a variable.

enum Power {
  None = 0, // Value 0 in decimal (00 in binary)
  Invincibility = 1 << 0, // Value 1 in decimal (01 in binary)
  Telepathy = 1 << 1, // Value 2 in decimal (10 in binary)
  Invisibility = 1 << 2, // Value 4 in decimal (100 in binary)
  Everything = Invincibility | Telepathy | Invisibility,
}
let power: Power = Power.Invincibility | Power.Telepathy
console.log('Power values:' + power)

if (power & Power.Telepathy) {
  console.log('Power available')
}
if (power & Power.Invisibility) {
  console.log('Power of available')
}

// remove a value from a bitwise enum on the fly by using &= ~ which performs an and operation on the inverse of the value.
// For example, the following code supplements the previous example by removing the Telepathy power. Line 13 has the remove operation.
power &= ~Power.Telepathy
console.log('Power values:' + power)
if (power & Power.Telepathy) {
  console.log('Power available')
}

// you can add a value with |= operator
power |= 7 // 7 is 0b111 in binary
console.log('Power values:' + power)
if (power === Power.Everything) {
  console.log('Everything')
}

///////// accessing enum values
enum Orientation {
  East,
  West,
  North,
  South = 's',
}
// Access with the Enum
Orientation.East //?
// Access the Enum string from number
Orientation[2] //?
// not possible with an enum that has strings for value
// Orientation['s'] // error
// Orientation[3] // undefined

//////////// enums with functions
enum Orientation2 {
  East,
  West,
  North,
  South,
}
namespace Orientation2 {
  export const yourFunction = () => 'I am in a Enum'
}
Orientation2.yourFunction() //?
