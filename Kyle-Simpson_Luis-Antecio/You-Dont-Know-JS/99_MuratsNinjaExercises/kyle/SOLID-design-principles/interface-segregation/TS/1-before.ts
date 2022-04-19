// Interface Segregation Principle: isolate your interfaces

// problem: when a class implements an interface, it has to define all the properties and methods of that interface
// although it may not use some of the properties and methods of the interface

// note: you can use some of js-to-ts-converter
// npx js-to-ts-converter ./kyle/SOLID-design-principles/interface-segregation/TS

{
  interface IEntity {
    name: string;
    attackDamage: number;
    health: number;

    move(): string;
    attack(targetEntity: Entity): string;
    takeDamage(amount: number): void;
  }

  class Entity implements IEntity {
    constructor(
      public name: string,
      public attackDamage: number,
      public health: number
    ) {}

    move() {
      return `${this.name} moved`;
    }

    attack(targetEntity: Entity) {
      targetEntity.takeDamage(this.attackDamage);
      return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
    }

    takeDamage(amount) {
      this.health -= amount;
      console.log(`${this.name} has ${this.health} health remaining`);
    }
  }

  class Character extends Entity implements IEntity {}

  // problem: wall only takes damage, still has to implement move and attack
  class Wall extends Entity implements IEntity {
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

  //  problem: turret only attacks, still has to implement move and takeDamage
  class Turret extends Entity implements IEntity {
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
}
