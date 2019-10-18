const ninja = { name:"Yoshi", action:"skulk", weapon:"shuriken" };

// DESTRUCTURING is used to extract data from objects and arrays

// OLD WAY: we have to explicitly assign each property to a variable
const nameOld = ninja.name;
const actionOld = ninja.action;
const weaponOld = ninja.weapon;

console.log(ninja);
console.log(nameOld, actionOld, weaponOld);

// DESTRUCTURING : we can assign each property to a variable of the same, name all at once
const {name, action, weapon} = ninja;
console.log(ninja);
console.log(name, action, weapon);

const { name: myName, action: myAction, weapon: myWeapon } = ninja; // when destructuring we can rename variables
console.log(myName, myAction, myWeapon);