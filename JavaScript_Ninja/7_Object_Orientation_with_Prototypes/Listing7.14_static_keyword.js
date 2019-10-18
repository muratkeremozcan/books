class Ninja {
  constructor (name, level) {
    this.name = name;
    this.level = level;
  }
  swingSword() { // all non-static methods are defined at instance level as opposed to class level
    return true;
  }
  static compare(ninja1, ninja2) { // STATIC METHOD: these are used to define method on class level as opposed to instance level
    return ninja1.level - ninja2.level;
  }
}

var ninja1 = new Ninja("Yoshi", 4);
var ninja2 = new Ninja("Hattori", 3);

console.log('compare' in ninja1); // IMPORTANT: object instances do not have access to static method
console.log('compare' in ninja2);

console.log(Ninja.compare(ninja1, ninja2)); // IMPORTANT: only the class itself has access to the static method

console.log('swingSword' in Ninja); // IMPORTANT: the non-static method is not accessible to the class...
console.log('swingSword' in ninja1); // ...the method is accessible to an instance of the class
console.log('swingSword' in ninja2);