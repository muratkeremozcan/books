const name = "Yoshi";

// regular object literal
const oldNinja = {
  name: name,
  getName: function(){ // a method on an object property
    return this.name;
  }
};
oldNinja["old" + name] = true; // creates a property with a dynamically calculated name

oldNinja["name"] = 'boo'; // we access object properties like this
// oldNinja.getName = 'assigned new'; // or dot notation
console.log(oldNinja);


// ENHANCED OBJECT LITERALs
const newNinja = {
  name, // PROPERTY VALUE SHORTHAND; assigns the value of the same named variable to the property. same as name: name,
  getName(){ // METHOD DEFINITION SHORTHAND: aka CONCISE METHODS
    return this.name;
  },
  ["new" + name]: true // COMPUTED PROPERTY NAME, instead of a dynamically calculated name being assigned a value
};
console.log(newNinja);