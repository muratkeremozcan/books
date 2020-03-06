var foo = (function CoolModule() {
  var something = 'cool';
  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join('!'));
  }

  return {
    doSomething,
    doAnother
    // or
    // doSomething: doSomething,
    // doAnother: doAnother

  };

}());


foo.doSomething();
foo.doAnother();

// Modules are just functions, so they can receive parameters:

function CoolerModule(id) {
  function identify() {
    console.log(id);
  }

  return {
    identify
    // or
    // identify: identify
  };
}

var foo1 = CoolerModule('foo 1');
var foo2 = CoolerModule('foo 2');

foo1.identify();
foo2.identify();

// Another slight but powerful variation on the module pattern is to name the object you are returning as your public API:
var foo = (function CoolModule(id) {

  // public function
  function identify1() {
    console.log(id);
  }
  
  // private function
  function identify2() {
    return console.log(id.toUpperCase());
  }
  
  function change() {
    // modifying the public API
    publicAPI.identify = identify2();
  }

  // By retaining an inner reference to the public API object inside your module instance, 
  // you can modify that module instance from the inside, including adding and removing methods and properties, and changing their values.

  var publicAPI = {
    change: change,
    identify: identify1
  };

  return publicAPI;
})("food module");


foo.identify();
foo.change();

