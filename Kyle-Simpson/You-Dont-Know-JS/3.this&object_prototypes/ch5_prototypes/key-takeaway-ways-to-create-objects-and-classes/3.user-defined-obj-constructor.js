// this approach is ok. There is linking, there is constructor.
// the syntax is outdated and verbose. Better to use ES6 class syntax nowadays.

function movies(name, releaseYear, genre, ratings) {
  this.name = name;
  this.releaseYear = releaseYear;
  this.genre = genre;
  this.ratings = ratings;
  this.watch = function() {
    console.log("Watch Online");
  };
}

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
DPS.watch();

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
