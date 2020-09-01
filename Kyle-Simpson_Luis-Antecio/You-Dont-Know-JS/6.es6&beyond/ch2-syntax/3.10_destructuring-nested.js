// If the values you’re destructuring have nested objects or arrays, you can destructure those nested values as well

// an array and object
var a1 = [1, [2, 3, 4], 5];
var o1 = {
  x: {
    y: {
      z: 6
    }
  }
};
// now, destructure
var [a, [b, c, d], e] = a1;
var {
  x: {
    y: {
      z: w
    }
  }
} = o1

a;
b;
c;
d;
e;

w;


// Nested destructuring can be a simple way to flatten out object namespaces.
var App = {
  model: {
    User: function () {/*..*/ }
  }
};
// instead of:
// var User = App.model.User;
// just do:
var {
  model:
  {
    User
  }
} = App;