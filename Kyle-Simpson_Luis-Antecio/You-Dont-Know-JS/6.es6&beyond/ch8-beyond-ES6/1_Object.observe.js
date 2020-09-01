// the idea is that you can set up a listener to observe an object’s changes, 
// and have a callback called any time a change occurs.
// add, update, delete, reconfigure, setPrototype, preventExtensions


var obj = { a: 1, b: 2 };

Object.observe(obj, function (changes) {
  for (var change of changes) {
    console.log(change);
  }
}, ["add", "update", "delete"]
// By default, you’ll be notified of all these change types, but you can filter down to only the ones you care about.
);

obj.c = 3; 
// { name: "c", object: obj, type: "add" }

obj.a = 42; 
// { name: "a", object: obj, type: "update", oldValue: 1 } 

delete obj.b; 
// { name: "b", object: obj, type: "delete", oldValue: 2 }
