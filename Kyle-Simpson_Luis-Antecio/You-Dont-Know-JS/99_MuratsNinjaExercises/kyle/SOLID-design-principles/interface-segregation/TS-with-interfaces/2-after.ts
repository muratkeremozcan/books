// Interface Segregation Principle: break apart your interfaces

// solution: break apart the interfaces
{
  class Entity {
    public name: any;

    constructor(name) {
      this.name = name;
    }
  }

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

  // (2) classes extend the main entity and add on their own properties
  class Character extends Entity {
    public attackDamage: any;
    public health: any;

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

  class Wall extends Entity {
    public health: any;

    constructor(name, health) {
      super(name);
      this.health = health;
    }
  }

  Object.assign(Wall.prototype, hasHealth);

  class Turret extends Entity {
    public attackDamage: any;

    constructor(name, attackDamage) {
      super(name);
      this.attackDamage = attackDamage;
    }
  }

  Object.assign(Turret.prototype, attacker);

  const turret = new Turret("turret", 5);
  const wall = new Wall("wall", 200);
  const character = new Character("character", 3, 100);

  turret.attack(character); //?
  character.move(); //?
  character.attack(wall); //?
}
