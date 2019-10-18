// 9.21 combining sets
const ninjas = new Set(["Kuma", "Hattori", "Yagyu"]);
const samurai = new Set(["Hattori", "Oda", "Tomoe"]); // duplicate Hattori

const warriors = new Set([...ninjas, ...samurai]); // use rest parameters/spread operators to turn the set into an array, allow to merge Sets ninjas and samurai

console.log(warriors.has("Kuma"));
console.log(warriors.has("Hattori"));
console.log(warriors); // no dupes

// 9.22 Intersection of sets
const ninjaSamurais = new Set([...ninjas].filter(ninja =>  // use rest parameters/spread operators to turn the set into an array, allow to use array.filter
  samurai.has(ninja))   // filter: iterate through the input array with the callback condition, return ALL array items that satisfy the condition
); // gets samurai who are ninja
console.log(ninjaSamurais);

// 9.23 Difference of sets
const pureNinjas = new Set([...ninjas].filter(ninja =>  // use rest parameters/spread operators to turn the set into an array, allow to use array.filter
  !samurai.has(ninja))   // filter: iterate through the input array with the callback condition, return ALL array items that satisfy the condition
); // gets samurai who are not ninja
console.log(pureNinjas);
