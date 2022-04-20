// inheritance is about what objects are
// composition is about what they can do
// lego blocks, build them up

{
  const attacker = ({ name }: { name: string }) => ({
    attack: () => `${name} attacks`,
  });

  const walker = ({ name }: { name: string }) => ({
    walk: () => `${name} walks`,
  });

  const flyer = ({ name }: { name: string }) => ({
    fly: () => `${name} flies`,
  });

  const swimmer = ({ name }: { name: string }) => ({
    swim: () => `${name} swims`,
  });

  const monsterCreator = (name: string) => {
    const monster = { name };

    return {
      ...monster,
      ...walker(monster),
      ...attacker(monster),
    };
  };

  const flyingMonsterCreator = (name: string) => {
    const monster = { name };

    return {
      ...monster,
      ...monsterCreator(name),
      ...flyer(monster),
    };
  };

  const swimmingMonsterCreator = (name: string) => {
    const monster = { name };

    return {
      ...monster,
      ...attacker(monster),
      ...swimmer(monster),
    };
  };

  const flyingSwimmingMonsterCreator = (name: string) => {
    const monster = { name };

    return {
      ...monster,
      ...flyingMonsterCreator(name),
      ...swimmer(monster),
    };
  };

  const bear = monsterCreator("bear");
  bear.walk(); //?
  bear.attack(); //?

  const eagle = flyingMonsterCreator("eagle");
  eagle.walk(); //?
  eagle.attack(); //?
  eagle.fly(); //?

  const shark = swimmingMonsterCreator("shark");
  shark.attack(); //?
  shark.swim(); //?

  const chimera = flyingSwimmingMonsterCreator("chimera");
  chimera.name; //?
  chimera.walk(); //?
  chimera.attack(); //?
  chimera.swim(); //?
  chimera.fly(); //?
}
