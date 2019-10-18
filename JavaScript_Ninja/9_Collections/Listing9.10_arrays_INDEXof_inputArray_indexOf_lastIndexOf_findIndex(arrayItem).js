const ninjas = ["Yagyu", "Yoshi", "Kuma", "Yoshi"];

// INDEXOF :  inputArray.indexOf(<arrayItem>)
console.log(ninjas.indexOf("Yoshi"));
// LASTINDEXOF : inputArray.lastIndexOf(<arrayItem>)
console.log(ninjas.lastIndexOf("Yoshi"));
// FINDINDEX : inputArray.findIndex(callBack with condition)
console.log(ninjas.findIndex(ninja => ninja ==="Yoshi")); // iterate through the input array with the callback condition, return the INDEX OF the first array item that satisfies the condition
console.log(ninjas.findIndex(ninja => ninja ==="Kuma")); // very much like arrayItem.findp