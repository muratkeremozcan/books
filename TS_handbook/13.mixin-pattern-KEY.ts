// problem: no multiple parents : class User extends Tagged, Timestamped { // ERROR : no multiple inheritance
// we want user to inherit from both TimeStamped and Activatable

// instead of a class User extending class Tagged/Timestamped to get its functionality, 
// functions Tagged/Timestamped take class User and return a new class with this added functionality. Then, Function Tagged/Timestamped are mixins.

// [A mixin is] a function that
// takes a constructor, (1)
// creates a class that extends that constructor(2)
// returns the new class which as new functionality(3)


// Mixins take a class and extend it with new functionality. 
// That class will be able to 'inherit' from multiple parents
// So we need to define what is a constructor. This is needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T; // (1) create a constructor

////////////////////
// Example mixins
////////////////////

// A mixin that adds a property
function Timestamped<TBase extends Constructor>(Base: TBase) { // (2) extend the constructor
  return class extends Base { // (3) return the new class which has new functionality
    timestamp = Date.now();
  };
}

// a mixin that adds a property and methods
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;

    activate() {
      this.isActivated = true;
    }

    deactivate() {
      this.isActivated = false;
    }
  };
}

////////////////////
// Usage to compose classes
////////////////////

// Simple class
class User {
  name = '';
}
// User that is Timestamped (User inherits from TimeStamped)
const TimestampedUser = Timestamped(User);

// User that is Timestamped and Activatable  (User inherits from Activatable and Timestamped)
const TimestampedActivatableUser = Timestamped(Activatable(User));

////////////////////
// Using the composed classes
////////////////////

const timestampedUserExample = new TimestampedUser();
console.log(timestampedUserExample.timestamp);

const timestampedActivatableUserExample = new TimestampedActivatableUser();
console.log(timestampedActivatableUserExample.timestamp);
console.log(timestampedActivatableUserExample.isActivated);