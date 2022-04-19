// Interface Segregation Principle: TL, DR; compose small shit into bigger shit vs inherit BIG shit partially in the children

// solution: create smaller interfaces and a base class, have all classes compose from them
// (1) create smaller interfaces
// (2) create the main entity
// (2.1) classes extend the main entity
// (3) attach the smaller interfaces to the classes as needed

// (1) create smaller interfaces
const mover = {
  move() {
    return `${this.name} moved`;
  },
};

const attacker = {
  attack(targetEntity) {
    targetEntity.takeDamage(this.attackDamage);
    return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
  },
};

const hasHealth = {
  takeDamage(amount) {
    this.health -= amount;
    console.log(`${this.name} has ${this.health} health remaining`);
  },
};

// (2) create the main entity
class Entity {
  constructor(name) {
    this.name = name;
  }
}

// (2.1) classes extend the main entity and add on their own properties
class Character extends Entity {
  constructor(name, attackDamage, health) {
    super(name);
    this.attackDamage = attackDamage;
    this.health = health;
  }
}
// (3) attach the smaller interfaces to the classes as needed
Object.assign(Character.prototype, mover);
Object.assign(Character.prototype, attacker);
Object.assign(Character.prototype, hasHealth);

// (2.1) classes extend the main entity and add on their own properties
class Wall extends Entity {
  constructor(name, health) {
    super(name);
    this.health = health;
  }
}
// (3) attach the smaller interfaces to the classes as needed
Object.assign(Wall.prototype, hasHealth);

// (2.1) classes extend the main entity and add on their own properties
class Turret extends Entity {
  constructor(name, attackDamage) {
    super(name);
    this.attackDamage = attackDamage;
  }
}
// (3) attach the smaller interfaces to the classes as needed
Object.assign(Turret.prototype, attacker);

const turret = new Turret("turret", 5);
const wall = new Wall("wall", 200);
const character = new Character("character", 3, 100);

turret.attack(character); //?
character.move(); //?
character.attack(wall); //?
