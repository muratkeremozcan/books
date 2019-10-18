const ninjas = [{
    name: "Yagyu",
    weapon: "shuriken"
  },
  {
    name: "Yoshi",
    // weapon: "katana"  // toggle this and other matching properties to test
  },
  {
    name: "Kuma",
    weapon: "wakizashi"
  }
];
// EVERY method : inputArray.every
const allNinjasAreNamed = ninjas.every(ninja => "name" in ninja); // EVERY: a callback to each input array item, iterates, if all return TRUE, returns true
console.log(allNinjasAreNamed);

const allNinjasAreArmed = ninjas.every(ninja => "weapon" in ninja);
console.log(allNinjasAreArmed);

// SOME method : inputArray.some
const someNinjasAreNamed = ninjas.some(ninja => "name" in ninja); // SOME: a callback to each input array item, iterates, if ONE returns TRUE, returns true
console.log(someNinjasAreNamed);

const someNinjasAreArmed = ninjas.some(ninja => "weapon" in ninja);
console.log(someNinjasAreArmed);
