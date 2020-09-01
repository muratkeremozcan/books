// Getters are properties that actually call a hidden function to retrieve a value. 
// Setters are properties that actually call a hidden function to set a value. 
// When you define a property to have either a getter or a setter or both, 
  // its definition becomes an “accessor descriptor” (as opposed to a “data descriptor”).


var myObject = {
  get a() {
    return this._a_;
  },
  set a(val) {
    this._a_ = val * 2;
  }
}
//set
myObject.a = 5 
// get
myObject.a; //?

// existance
('a' in myObject); //?
('b' in myObject); //?

myObject.hasOwnProperty('a'); //?
myObject.hasOwnProperty('b'); //?

// more robust way of performing a check
Object.prototype.hasOwnProperty.call(myObject, 'a'); //?
Object.prototype.hasOwnProperty.call(myObject, 'b'); //?