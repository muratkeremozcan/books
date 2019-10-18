// PROTOTYPE
function Warrior(weapon) {
  this.weapon = weapon;
}
Warrior.prototype.wield = function() { // modifying the prototype object method is like having a regular function
  return "Wielding " + this.weapon;
}
Warrior.duel = function(warrior1, warrior2) { // modifying the property as a function is like static function 
  return warrior1.wield()  + ' vs ' + warrior2.wield();
};
var mustafaTheWarrior = new Warrior('araba');
console.log(mustafaTheWarrior.weapon);
console.log(mustafaTheWarrior.wield());


// CLASS
// IMPORTANT: everything in a class definition is either a constructor, a method, or a static function.
// No need to spell out "function" when everything in a class already is
class WarriorClass {
  constructor(weapon) {
    this.weapon = weapon;
  }
  wield() {
    return "Wielding " + this.weapon;
  }
  static duel (warrior1, warrior2) {
    return warrior1.wield() + ' vs ' + warrior2.wield();
  }
}

var muratTheWarrior = new WarriorClass('sopa');
console.log(muratTheWarrior.weapon);
console.log(muratTheWarrior.wield());

console.log(Warrior.duel(muratTheWarrior, mustafaTheWarrior));
console.log(WarriorClass.duel(muratTheWarrior, mustafaTheWarrior));