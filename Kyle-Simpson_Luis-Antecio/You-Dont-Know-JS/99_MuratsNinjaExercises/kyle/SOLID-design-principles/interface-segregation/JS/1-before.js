// Interface Segregation Principle: TL, DR; compose small shit into bigger shit vs inherit BIG shit partially in the children

// problem: when a class implements an interface, it has to define all the properties and methods of that interface
// although it may not use some of the properties and methods of the interface

// in JS there are no interfaces, so we use classes and inheritance

class Entity {
  constructor(name, attackDamage, health) {
    this.name = name;
    this.attackDamage = attackDamage;
    this.health = health;
  }

  move() {
    return `${this.name} moved`;
  }

  attack(targetEntity) {
    targetEntity.takeDamage(this.attackDamage);
    return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`${this.name} has ${this.health} health remaining`);
  }
}

class Character extends Entity {}

// Wall cannot move or attack
class Wall extends Entity {
  constructor(name, health) {
    super(name, 0, health);
  }

  move() {
    return null;
  }

  attack() {
    return null;
  }
}

// Turret cannot move and take damage
class Turret extends Entity {
  constructor(name, attackDamage) {
    super(name, attackDamage, -1);
  }

  move() {
    return null;
  }

  takeDamage() {
    return null;
  }
}

const turret = new Turret("turret", 5);
const wall = new Wall("wall", 200);
const character = new Character("character", 3, 100);

turret.attack(character); //?
character.move(); //?
character.attack(wall); //?
