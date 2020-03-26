// enums with flags

// Here we are using the left shift operator to move 1 around a certain level of bits
// to come up with bitwise disjoint numbers 0001, 0010, 0100 and 1000
enum AnimalFlags {
  None           = 0,
  HasClaws       = 1 << 0,
  CanFly         = 1 << 1,
  EatsFish       = 1 << 2,
  Endangered     = 1 << 3
}
// custom type with enum
type Animal = {
  flags: AnimalFlags
}

function printAnimalAbilities(animal: Animal) {
  var animalFlags = animal.flags;

  // single & and single | are the bitwise operators
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  if (animalFlags & AnimalFlags.HasClaws) {
    console.log('animal has claws');
  } 
  if (animalFlags & AnimalFlags.CanFly) {
    console.log('animal can fly');
  }
  if (animalFlags == AnimalFlags.None) {
    console.log('nothing');
  }
}

let animal: Animal = { flags: AnimalFlags.None }; // initialize
printAnimalAbilities(animal); // starts with nothing

animal.flags; //?
AnimalFlags.HasClaws //?
// using |= to add flags: animal.flags = animal.flags OR AnimalFlags.HasClaws - gives 0001
animal.flags |= AnimalFlags.HasClaws;
animal.flags; //?
printAnimalAbilities(animal); // animal has claws

animal.flags; //?
AnimalFlags.HasClaws; //?
// a combination of &= and ~ to clear a flag: animal.flags = animal.flags AND !AnimalFlags.HasClaws - gives 0010
animal.flags &= ~AnimalFlags.HasClaws;
animal.flags; //?
printAnimalAbilities(animal); // nothing


animal.flags; //?
AnimalFlags.HasClaws; //?
AnimalFlags.CanFly; //?
// | to combine flags
// animal.flags = animalflags OR (AnimalFlags.HasClaws OR AnimalFlags.CanFly -> this gives 0011)
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly