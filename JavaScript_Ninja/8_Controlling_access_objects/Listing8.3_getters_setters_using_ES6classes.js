class NinjaCollection {
  constructor() {
    this.ninjas = ["Yoshi", "Kuma", "Hattori"];
  }
  get firstNinja() { // getter method, for first ninja
    console.log('getting firstNinja');
    return this.ninjas[0];
  }
  set firstNinja(value){ // setter method for ninja
    console.log('setting firstNinja');
    this.ninjas[0] = value;
  }
}
// a get method is implicitly called when we read, a set method implicitly called when we write to a property
const ninjaCollection = new NinjaCollection(); // create an object instance
console.log(ninjaCollection.firstNinja);

ninjaCollection.firstNinja = "Hachi";; // to set, assign a value to the property
console.log(ninjaCollection.firstNinja); // to get, call the property

