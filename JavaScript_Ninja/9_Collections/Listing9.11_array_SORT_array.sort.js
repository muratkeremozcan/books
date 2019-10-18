// SORT : array.sort
// array.sort((a, b) => a-b)
// sort the numbers: by default sorts them in unicode, but a return operator makes it behave differently
// a-b : return + : a > b  -> push a right
// a-b : return - : a < b  -> push a left

// compare with .37

const ninjas = [{
    name: "Yoshi"
  },
  {
    name: "Yagyu"
  },
  {
    name: "Kuma"
  }
];

ninjas.sort((ninja1, ninja2) => {
  if (ninja1.name > ninja2.name) { return 1; } // if a is bigger, push a right
  if (ninja1.name < ninja2.name) { return -1; } // if a is smaller, push a left
  return 0; // if equal, do nothing
});
console.log(ninjas);