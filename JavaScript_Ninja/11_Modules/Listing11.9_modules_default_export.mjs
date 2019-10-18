// we use this when we want to export the whole module / a single class
export default class Ninja { // EXPORT DEFAULT to specify the default module binding
  constructor(name) {
    this.name = name;
  }
}

export function compareNinjas(ninja1, ninja2) { // can still use named exports with default export
  return ninja1.name === ninja2.name;
}