const ninjas = ["Yoshi", "Kuma", "Hattori"];

const [firstNinja, secondNinja, thirdNinja] = ninjas; // array items are assigned to variables, in order
console.log(firstNinja, secondNinja, thirdNinja);

const [, , third] = ninjas; // we can skip array items
console.log(third);

const [first, ...remaining] = ninjas; // we can capture trailing array items (in a new array) with REST PARAMETERs
console.log(first);
console.log(remaining);