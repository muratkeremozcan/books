// this example mimicks the Set collection using objects
function Set() {
  this.data = {}; // uses an object to store items
  this.length = 0;
}
Set.prototype.has = function (item) {
  return typeof this.data[item] !== "undefined"; // if the Set does not have an item, this will be undefined. If it does have the item it will return the type
};
Set.prototype.add = function (item) {
  if(!this.has(item)) { // if the item is not contained in the Set, add it
    this.data[item] = true;
    this.length++;
  }
};
Set.prototype.remove = function(item) {
  if(this.has(item)){ // if the item is contained in the Set, remove the item
    delete this.data[item];
    this.length--;
  }
};
const ninjas = new Set();
ninjas.add("Hattori");
console.log( typeof ninjas.data["Hattori"] );
console.log( ninjas.has("Hattori"));

ninjas.add("Hattorik"); // tries to add the object twice, but i contains 1 object 
console.log(ninjas);

ninjas.remove("Hattori"); // this causes the Set to become empty
console.log(ninjas);


ninjas.add(7);
console.log(ninjas);

ninjas.add({data: "Murat"}); // IMPORTANT: you cannot add objects, only strings and numbers. This is why we need the Set type of collection
console.log(ninjas);
