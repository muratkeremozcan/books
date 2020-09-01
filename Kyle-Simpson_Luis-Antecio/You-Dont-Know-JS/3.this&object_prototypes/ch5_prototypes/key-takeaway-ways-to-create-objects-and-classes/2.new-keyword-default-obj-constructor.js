// Objects can also be created using the new keyword. With the built-in Object Constructor in Javascript, 
// IMPORTANT limitation you can use this as long as you're not trying to make new instances under it :  let rocky = new movies() will not work
// with this usage, there is no clear advantage over object literal.

const movies = new Object({
  name: 'Dead Poets Society',
  releaseYear: 1989,
  genre: ['Drama', 'Teen'],
  ratings: {
    IMDb: "8.1 / 10",
    Metacritic: "79%"
  },
  watch() {
    return console.log("Watch Online");
  }
});

// the really lame way of doing it: create new object and then add properties
// let movies = new Object();
// movies.name = "Dead Poets Society";
// movies.releaseYear = 1989;
// movies.genre = ["Drama", "Teen"];
// movies.ratings = {
//   IMDb: "8.1 / 10",
//   Metacritic: "79%"
// };
// movies.watch = () => {
//   return console.log("Watch Online");
// };

// WILL NOT WORK, because no constructor for our new object 
// let rocky = new movies("Rocky", 1976, ["Drama", "Sports"], {
//   IMDb: "8.1 / 10",
//   Metacritic: "70%"
// });

// you can use object create, but then you still can't make new objects from it with UNIQUE properties 
// let rocky = Object.create(movies);


console.log(movies);
movies.watch();

// limitation: no linking
Object.getPrototypeOf(movies); //? 
movies.hasOwnProperty('name'); //?  
Object.getOwnPropertyNames(movies); //?
movies.__proto__; //?
movies.__proto__.__proto__; //?

