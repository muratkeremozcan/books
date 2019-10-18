const samurai = [];

samurai.push("Oda");
samurai.unshift("Tomoe");
console.log(samurai);

samurai.splice(1, 0, "Hattori", "Takeda"); // can use SPLICE to not delete and just add items
console.log(samurai);


const ninjas = [
  {
    name: "Yoshi",
    age: 18
  }, {
    name: "Hattori",
    age: 19
  },
  {
    name: "Yagyu",
    age: 20
  }
]
const persons = [];

const first = ninjas.map(ninja => ninja.age);
console.log(first);

const second = first.filter(age => age % 2 == 0);
console.log(second);

const third = second.reduce((aggregate, item) => aggregate + item, 0);
console.log(third);