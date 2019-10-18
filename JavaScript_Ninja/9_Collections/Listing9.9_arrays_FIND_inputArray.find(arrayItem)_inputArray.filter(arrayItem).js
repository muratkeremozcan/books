
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
    weapon: "wakizashi" // toggle this and other matching properties to test
  }
];
// FIND method: inputArray.find
const ninjaWithWakizashi = ninjas.find( ninja => { // iterate through the input array with the callback condition, return the FIRST array item that satisfies the condition
  return ninja.weapon === "wakizashi";
})
console.log(ninjaWithWakizashi);

const ninjaWithKatana = ninjas.find( ninja => {
  return ninja.weapon === "katana";
});
console.log(ninjaWithKatana); // FIND returns UNDEFINED if the item with the condition cannot be found

// FILTER method : inputArray.filter
const armedNinjas = ninjas.filter( ninja => "weapon" in ninja);  // iterate through the input array with the callback condition, return ALL array items that satisfy the condition
console.log(armedNinjas);

const armedNinjasMap = ninjas.map( ninja => "weapon" in ninja);
console.log(armedNinjasMap);