var ninja = {};
ninja.name = "Yoshi"; // using assignments to add 2 properties
ninja.weapon = "kusarigama";

// Object.defineProperty (<object>, "<name of property>" , {<attributes of property>})
Object.defineProperty(ninja, "sneaky", { // Object.defineProperty method used to define a property named sneaky
  configurable: false, // not configurable
  enumerable: false, // not enumerable IMPORTANT, switch this to true and it shows up in the for loop
  value: true, // value is set to true
  writable: true // the value can be changed
});

console.log("sneaky" in ninja); // true
console.log(ninja.sneaky);

for (let prop in ninja) { // using the for-in loop to iterate over ninja's enumerable properties
  console.log(prop); // the new property "sneaky" will show up if enumerable is true
}
