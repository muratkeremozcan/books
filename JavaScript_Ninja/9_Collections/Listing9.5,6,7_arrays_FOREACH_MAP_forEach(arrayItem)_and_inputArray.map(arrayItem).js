const ninjas = [{
    name: "Yagyu",
    weapon: "shuriken"
  },
  {
    name: "Yoshi",
    weapon: "katana"
  },
  {
    name: "Kuma",
    weapon: "wakizashi"
  }
];

// for (let i = 0; i < ninjas.length, i++;) // regular loop
ninjas.forEach(ninja => { // for each arrayItem
  console.log(ninja);
});

// SIMPLE EXTRACTION OF AN ARRAY FROM AN ARRAY : creating new arrays based on existing arrays
const ninjaNames = []; // create an empty array
ninjas.forEach(ninja => { // forEach takes a callback for each array item
  ninjaNames.push(ninja.name); // push each ninja weapon into the empty array
});
console.log(ninjaNames);

// The better way of creating new arrays based on existing arrays
// MAP method: inputArray.map
const weapons = ninjas.map( ninja => ninja.weapon ); // MAP applies a callback to each input array item, iterates and creates a new array with the return values
// const weapons = ninjas.map( ninja => { // multi-line version
//   return ninja.weapon;
// });
console.log(weapons);
