let movies = {
  init(name, releaseYear, genre, ratings) {
    this.name = name;
    this.releaseYear = releaseYear;
    this.genre = genre;
    this.ratings = ratings;
  },
  // watch: function() ... // we used to have to do this before ES6
  watch () {
    console.log('Watch Online');
  }
}

// key differences:
// With class constructors, you are forced (not really, but it is strongly suggested) to do both construction and initialization in the same step.
// OLOO better supports the principle of separation of concerns,
// where creation and initialization are not necessarily conflated into the same operation.
let rocky = Object.create(movies);
// let rocky = new movies(); // cannot use the new keyword because there is no constructor!!
rocky; //?
rocky.init('Rocky', 1976, ['Drama', 'Sports'], {
  IMDb: "8.1 / 10",
  Metacritic: "70%"
});
rocky; //?

rocky.watch();

// at the end ES6 class vs OLOO are very similar
Object.getPrototypeOf(rocky); //?
rocky.hasOwnProperty('ratings'); //?
Object.getOwnPropertyNames(rocky); //?
rocky.__proto__; //?
rocky.__proto__.__proto__; //?
rocky.__proto__.__proto__.__proto__; //?



////////////
// Let's make a non-prototype linked instance

let DPS = Object.assign({}, movies);

DPS; //?
DPS.init("Dead Poets Society", 1989, ["Drama", "Teen"], {
  IMDb: "8.1 / 10",
  Metacritic: "79%"
});
DPS; //?

// tadaa!
Object.getPrototypeOf(DPS); //?
DPS.hasOwnProperty('ratings'); //?
Object.getOwnPropertyNames(DPS); //?
DPS.__proto__; //?
DPS.__proto__.__proto__; //?

