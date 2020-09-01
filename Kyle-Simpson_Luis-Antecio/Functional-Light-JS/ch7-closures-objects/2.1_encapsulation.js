// objects and closures can express collections of state
// they can also include behavior via functions/methods
// Bundling data with its behavior is called encapsulation



function person(name, age) {
  // The inner function happyBirthday() has closure over name and age so that the functionality therein is kept with the state.
  return function happyBirthday() {
    age++;
    console.log(`Happy ${age}th Birthday ${name}`);
  };
}

var birthdayBoy = person('Murat', 36); //?

birthdayBoy();


// alternative: this binding on object
// We’re still expressing the encapsulation of state data with the happyBirthday() function, but with an object instead of a closure.

var birthdayBoya = {
  name: 'Kyle',
  age: 36,
  happyBirthday () {
    this.age++
    console.log(`Happy ${this.age}th Birthday ${this.name}`);
  }
};

birthdayBoya.happyBirthday();

