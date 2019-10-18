const MouseCounterModule = function () { // global module variable, assigned to a IIF
  let numClicks = 0; // private module variable
  const handleClick = () => { // private module function
    console.log(++numClicks);
  };
  return { // returns an object that represents the module's interface. Through closures we can access "private" module variables and functions
    countClicks: () => {
      document.addEventListener("click", handleClick);
    }
  };
}();
console.log(typeof MouseCounterModule.countClicks); // can access module interface
console.log(typeof MouseCounterModule.numClicks); // cannot access inner module
console.log(typeof MouseCounterModule.handleClick); // cannot access inner module

// IMPORTANT: when augmenting a module, we extend its external interface with new functionality by passing the module to another IIF
// in this example we add the ability to countScrolls to our MouseCounterModule
// unfortunately, the extension does not allow access to its private variables from the original module

(function(module) { // immediately invokes a function that accepts the module we want to extend as an argument
  let numScrolls = 0; // private var
  const handleScroll = () => { // private function
    console.log(++numScrolls);
  }
  module.countScrolls = () => { // extends the module interface
    document.addEventListener("wheel", handleScroll);
  };
})(MouseCounterModule); // Passes in the module as an argument

console.log(typeof MouseCounterModule.countScrolls); // can access augmented module interface
console.log(typeof MouseCounterModule.countClicks); // can access original module interface
console.log(typeof MouseCounterModule.numScrolls); // cannot access inner module
