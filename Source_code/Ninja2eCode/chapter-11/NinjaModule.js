export default class Ninja {
  constructor(name) {
    this.name = name;
  }
}

export function compareNinjas(ninja1, ninja2){
  return ninja1.name === ninja2.name;
}

assert(true, "Ninja module");