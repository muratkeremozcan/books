const ninjaCollection = {
  ninjas: ["Yoshi", "Kuma", "Hattori"],
  get firstNinja() { // getter method, for first ninja
    console.log('getting firstNinja');
    return this.ninjas[0];
  },
  set firstNinja(value){ // setter method for ninja
    console.log('setting firstNinja');
    this.ninjas[0] = value;
  }
};

console.log(ninjaCollection.firstNinja); // to get, call the property

ninjaCollection.firstNinja = "Hachi";; // to set, assign a value to the property
console.log(ninjaCollection.firstNinja); // to get, call the property

