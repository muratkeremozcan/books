// COMPUTED PROPERTies provide use get and set methods to modify other properties indirectly
const shogun = {
  name: "Yoshiaki",
  clan: "Ashikaga",
  get fullTitle() { // getter method on a property of an object literal
    return this.name + " " + this.clan;
  },
  set fullTitle(value) { // setter method on a property of an object literal
    const segments = value.split(" ");
    this.name = segments[0]; // update the standard properties of the object literal
    this.clan = segments[1];
  }
};

// name and clan are normal properties that can get directly accessed
// COMPUTED PROPERTY: accessing the get method calls the get method which COMPUTES the value
console.log(shogun.name);
console.log(shogun.clan);
console.log(shogun.fullTitle);

// COMPUTED PROPERTY: accessing the set method computes and assigns new values to the original properties 
shogun.fullTitle = "Ieyasu Tokugawa"; // splits and gets assigned to name and clan
console.log(shogun.name);
console.log(shogun.clan);
console.log(shogun.fullTitle);