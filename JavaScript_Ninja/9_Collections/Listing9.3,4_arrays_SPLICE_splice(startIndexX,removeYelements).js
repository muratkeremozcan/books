const ninjas = ["Yagyu", "Kuma", "Hattori", "Fuma"];
// DELETE DOES NOT WORK, you create a hole in the array (undefined)
// delete ninjas[1]; // DELETE[index]
// console.log(ninjas);
// console.log(ninjas[1]);
let removeditems = ninjas.splice(1, 1); // ARRAY.SPLICE(X, Y) start at position x, remove y elements
console.log(removeditems);
console.log(ninjas);
console.log(ninjas.length);

removeditems = ninjas.splice(1, 1, "Mochizuki", "Yoshi", "Momochi"); // ARRAY.SPLICE(X, Y, <add in arguments>), start at x, remove y elements, add in the rest
console.log(removeditems); // splice returns an array of the removed items
console.log(ninjas); // splice inserts the arguments into the spot of the removed array element(s)
console.log(ninjas.length);

ninjas.splice(3, 1); // controlled delete item
console.log(ninjas);