const ninjas = [];
console.log(ninjas.length);

ninjas.push("Kuma"); // array.PUSH(..)  // add to the end
console.log(ninjas[0]);
console.log(ninjas.length);

ninjas.push("Hattori"); // array.PUSH(..)
console.log(ninjas);
console.log(ninjas.length);

ninjas.unshift("Yagyu"); // array.UNSHIFT( .. )  // add to the beginning
console.log(ninjas);
console.log(ninjas.length);

ninjas.unshift("Fuma"); // array.UNSHIFT( .. )  // add to the beginning
console.log(ninjas);
console.log(ninjas.length);

ninjas.pop(); // array.POP  // remove the end
console.log(ninjas);

const lastNinja = ninjas.pop(); // array.POP  // remove the end, assign it to an object
console.log(ninjas);
console.log(lastNinja);

ninjas.shift(); // array.SHIFT()  // remove the first item, other items are shifted left
console.log(ninjas);

const lastRemaining = ninjas.shift(); // array.SHIFT()  // remove the first item, assign to an object, other items are shifted left
console.log(ninjas);
console.log(lastRemaining);