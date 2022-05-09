// Interface Segregation Principle: TL, DR; compose small shit into bigger shit vs inherit BIG shit partially in the children

// solution: create smaller interfaces and a base class, have all classes compose from them
// (1) create smaller interfaces
// (2) create the main entity
// (2.1) classes extend the main entity
// (3) attach the smaller interfaces to the classes as needed

{
  // (1) create smaller interfaces
  interface IEntity {
    name: string;
  }

  interface IMover extends IEntity {
    move(): string;
  }

  interface IAttacker extends IEntity {
    attack(targetEntity: Entity): string;
  }

  interface IHasHealth extends IEntity {
    takeDamage(damage: number): void;
  }

  // (2.0) create the main entity
  class Entity implements IEntity {
    constructor(public name: string) {}
  }

  /** Lame helper to address duplication between Character and Wall */
  const damageHelper = (amount, health, name) => {
    health -= amount;
    console.log(`${name} has ${health} health remaining`);
  };
  // note: this is another lame solution https://www.koderhq.com/tutorial/typescript/composition/

  // (2.1) classes extend the main entity
  // (3) attach the smaller interfaces to the classes as needed
  class Character extends Entity implements IHasHealth, IMover, IAttacker {
    constructor(
      public name: string,
      public attackDamage: number,
      public health: number
    ) {
      super(name);
    }

    move() {
      return `${this.name} moved`;
    }

    attack(targetEntity: Wall) {
      targetEntity.takeDamage(this.attackDamage);
      return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
    }

    takeDamage(amount) {
      return damageHelper(amount, this.health, this.name);
    }
  }

  // (2) classes extend the main entity
  // (3) attach the smaller interfaces to the classes as needed
  class Wall extends Entity implements IHasHealth {
    constructor(public name: string, public health: number) {
      super(name);
    }

    takeDamage(amount) {
      return damageHelper(amount, this.health, this.name);
    }
  }

  // (2) classes extend the main entity
  // (3) attach the smaller interfaces to the classes as needed
  class Turret extends Entity implements IAttacker {
    constructor(public name: string, public attackDamage: number) {
      super(name);
    }

    attack(targetEntity) {
      targetEntity.takeDamage(this.attackDamage);
      return `${this.name} attacked ${targetEntity.name} for ${this.attackDamage} damage`;
    }
  }

  const turret = new Turret("turret", 5);
  const wall = new Wall("wall", 200);
  const character = new Character("character", 3, 100);

  turret.attack(character); //?
  character.move(); //?
  character.attack(wall); //?
}
