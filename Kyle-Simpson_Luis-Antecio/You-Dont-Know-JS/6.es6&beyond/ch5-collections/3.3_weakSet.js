// WeakMap holds its keys weakly (but its values strongly), a WeakSet holds its values weakly (there aren’t really keys).
// WeakSets are sets where the value is weakly held, so that GC can remove the entry if it’s the last reference to that object.
// WeakSet values must be objects, not primitive values as is allowed with sets.

var s = new WeakSet();

var x = {id: 1},
    y = {id: 2};

s.add(x);
s.add(y); //?

x = null; // 'x' is GC-eligible
s.has(x); //?
s.has(y); //?

y = null; // 'y' is GC-eligible 
s.has(y); //?
