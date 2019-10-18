function movies(name, releaseYear, genre, ratings) {
  this.name = name;
  this.releaseYear = releaseYear;
  this.genre = genre;
  this.ratings = ratings;
  this.watch = () => {
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
