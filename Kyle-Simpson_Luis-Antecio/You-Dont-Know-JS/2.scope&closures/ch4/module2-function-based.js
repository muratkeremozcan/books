// example of function based modules

var MyModules = (function Manager() {
  var modules = {};

  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }

    // invoking the function definition wrapper (impl) for a module, passing in any dependencies (deps), 
    // and storing the return value, the module’s API, into an internal list of modules tracked by name.
    modules[name] = impl.apply(impl, deps);
  }
  
  function get(name) {
    return modules[name];
  }
  
  return {
    define: define,
    get: get
  };
}());

MyModules.define('bar', [], function() { // function definition wrapper , no dependencies
  function hello(who) {
    return 'Let me introduce: ' + who;
  }

  // return public API
  return { 
    hello:hello
  };
})

MyModules.define('foo', ['bar'], function(bar) { // function definition wrapper, bar is a dependency
  var hungry = 'hippo';

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase() );
  }
  // return public API
  return {
    awesome: awesome
  };
})

var bar = MyModules.get('bar');
var foo = MyModules.get('foo');

console.log(bar.hello('hippo'));
foo.awesome();