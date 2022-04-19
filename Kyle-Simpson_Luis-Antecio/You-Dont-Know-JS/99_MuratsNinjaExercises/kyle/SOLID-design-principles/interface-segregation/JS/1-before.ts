// Interface Segregation Principle: isolate your interfaces

// problem: when a class implements an interface, it has to define all the properties and methods of that interface
// although it may not use some of the properties and methods of the interface

// in JS there are no interfaces, so we use classes and inheritance

interface IEntity {
  name: string;
  health: number;
  attackDamage: number;
}

class EntityTS implements IEntity {
  // name: string;
  // health: number;
  // attackDamage: number;

  // constructor(name: string, health: number, attackDamage: number) {
  //   this.name = name;
  //   this.attackDamage = attackDamage;
  //   this.health = health;
  // }
  // use the TS constructor shorthand instead of the lengthy constructor
  constructor(
    public name: string,
    public health: number,
    public attackDamage: number
  ) {}
  move() {
    return `${this.name} moved`;
  }

  attack(targetEntity) {
    // @ts-ignore
    targetEntity.takeDamage(this.attackDamage);
    return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
  }

  takeDamage(amount) {
    this.health -= amount;
    console.log(`${this.name} has ${this.health} health remaining`);
  }
}

class CharacterTS implements IEntity {
  name: string;
  health: number;
  attackDamage: number;
}

class WallTS extends EntityTS {
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

class TurretTS extends EntityTS {
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

const turretTS = new TurretTS("turret", 5);
const wallTS = new WallTS("wall", 200);
const characterTS = new CharacterTS("character", 3, 100);

turretTS.attack(characterTS); //?
characterTS.move(); //?
characterTS.attack(wallTS); //?
