// WeakMaps are maps where the key (object) is weakly held, so that GC is free to collect the entry if it’s the last reference to an object.
// WeakMaps take (only) objects as keys. Those objects are held weakly, which means if the object itself is GC’d, the entry in the WeakMap is also removed.
// they do not have size property or clear() method, they also do not expose any iterators (keys, values, entries) : only get (on first element), set, delete, has
// they are particularly useful if the object is not one you completely control, such as a DOM element.

// It’s important to note that a WeakMap only holds its keys weakly, not its values (better to name them WeakKeyMaps)

var m = new WeakMap();

var x = {id: 1},
    y = {id: 2},
    z = {id: 3},
    w = {id: 4};

m.set(x, y);

m.has(x); //?
m.get(x); //?
m.get(y); //?

x = null; // { id: 1 } is GC-eligible
m.get(x); //?
y = null; // { id: 2 } is GC-eligible only because { id: 1 } is
m.get(y); //?

m.set(z, w);
m.get(z); //?
m.get(w); //?

w = null; //{ id: 4 } is not GC-eligible
m.get(z); //?
m.get(w); //?