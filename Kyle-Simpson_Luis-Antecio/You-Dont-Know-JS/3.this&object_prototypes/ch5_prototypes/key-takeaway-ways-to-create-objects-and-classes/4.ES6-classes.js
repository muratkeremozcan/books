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
// With class constructors (new keyword), you are forced (not really, but it is strongly suggested) to do both construction and initialization in the same step 

let DPS = new movies("Dead Poets Society", 1989, ["Drama", "Teen"], {
  IMDb: "8.1 / 10",
  Metacritic: "79%"
});

let rocky = new movies("Rocky", 1976, ["Drama", "Sports"], {
  IMDb: "8.1 / 10",
  Metacritic: "70%"
});

console.log(DPS);
console.log(rocky);

rocky.watch();

// at the end ES6 class vs OLOO are very similar
Object.getPrototypeOf(movies); //? 
movies.hasOwnProperty('name'); //?
Object.getOwnPropertyNames(rocky); //?
rocky.__proto__; //?
rocky.__proto__.__proto__; //?
rocky.__proto__.__proto__.__proto__; //?



let newerMovies = new movies();
newerMovies.constructor; //?
newerMovies.constructor === movies; //?
newerMovies instanceof movies; //?
movies.prototype.isPrototypeOf(newerMovies); //?