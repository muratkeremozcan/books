// Objects can also be created using the new keyword. With the built-in Object Constructor in Javascript, 
// new creates an empty object; or, this keyword can be used with a user-defined constructor 

// However, this practice is not recommended, 
  // as there is a scope resolution behind the scenes to check if the constructor function is built-in or user-defined.

let movies = new Object();
movies;
// then  you add properties
movies.name = "Dead Poets Society";
movies.releaseYear = 1989;
movies.genre = ["Drama", "Teen"];
movies.ratings = {
  IMDb: "8.1 / 10",
  Metacritic: "79%"
};
movies.watch = () => {
  return console.log("Watch Online");
};

console.log(movies);
// console.log(movies.watch());
movies.watch();