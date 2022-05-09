class Monster {
  constructor(public name: string) {}

  attack(): string {
    return `${this.name} attacks`;
  }

  walk(): string {
    return `${this.name} walks`;
  }
}

class FlyingMonster extends Monster {
  fly(): string {
    return `${this.name} flies`;
  }
}

class SwimmingMonster extends Monster {
  swim(): string {
    return `${this.name} swims`;
  }
}

const bear = new Monster("bear");
bear.walk(); //?
bear.attack(); //?

const eagle = new FlyingMonster("eagle");
eagle.walk(); //?
eagle.attack(); //?
eagle.fly(); //?

const shark = new SwimmingMonster("shark");
shark.walk(); //?
shark.attack(); //?
shark.swim(); //?

// Problem with Inheritance:
// when there is a need for a child class to inherit from multiple parent classes
// then there is inevitable code duplication
// there is no good way to go about addressing it

class FlyingSwimmingMonster extends Monster {
  fly(): string {
    return `${this.name} flies`;
  }

  swim(): string {
    return `${this.name} swims`;
  }
}

const chimera = new FlyingSwimmingMonster("chimera");
chimera.walk(); //?
chimera.attack(); //?
chimera.fly(); //?
chimera.swim(); //?
