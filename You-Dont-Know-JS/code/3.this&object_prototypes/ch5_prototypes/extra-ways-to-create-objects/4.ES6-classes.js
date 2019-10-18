// This method is a lot similar to using new with the user-defined function constructor. 
  // Classes are the primary components of Object Oriented Programming (OOP). 
  // Many instances of classes can be created which are in fact objects. 
  // The constructor functions can now be replaced by classes, as they are supported in ES6 specifications

class movies {
  constructor(name, releaseYear, genre, ratings) {
    this.name = name;
    this.releaseYear = releaseYear;
    this.genre = genre;
    this.ratings = ratings;
  }
  watch() {
    console.log("Watch Online");
  }
}
let rocky = new movies("Rocky", 1976, ["Drama", "Sports"], {
  IMDb: "8.1 / 10",
  Metacritic: "70%"
});
console.log(rocky);

rocky.watch();



// if you do not want it linked, best is Object.assign