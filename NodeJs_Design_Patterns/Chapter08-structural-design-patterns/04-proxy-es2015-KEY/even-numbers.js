/*
The Proxy object is a feature deeply integrated into the JavaScript language itself, which enables developers to intercept and customize many operations that can be performed on objects. 
This characteristic opens up new and interesting scenarios that were not easily achievable before, such as meta-programming, operator overloading, and object virtualization.
This example allows us to see that, even though the Proxy object is commonly used to implement the Proxy pattern (hence the name), it can also be used to implement other patterns
*/

const evenNumbers = new Proxy([], {
  get: (target, index) => index * 2, // The get trap intercepts access to the array elements, returning the even number for the given index
  has: (target, number) => number % 2 === 0 // The has trap instead intercepts the usage of the in operator and checks whether the given number is even or not
  // The Proxy object supports several other interesting traps such as set, delete, and construct. nodejsdp.link/mdn-proxy
})

console.log(2 in evenNumbers) // true
console.log(5 in evenNumbers) // false
console.log(evenNumbers[7]) // 14
