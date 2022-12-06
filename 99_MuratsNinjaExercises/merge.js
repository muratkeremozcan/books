import R from "ramda";
import _ from "lodash";

const obj1 = {
  characters: [{ name: "barney" }, { name: "fred" }],
  a: 10,
  p: { x: 10, y: 20 },
  k: "k",
};

const obj2 = {
  characters: [{ age: 36 }, { age: 40 }],
  a: 20,
  p: { x: 20, z: 30 },
  t: "t",
};

// lodash merge example
// (obj1 <- obj2), deep merge, obj2 takes precedence on duplicates
_.merge(obj1, obj2);

// (ob1j -> obj2), shallow merge, obj2 takes precedence and takes in the extra keys from obj1
R.merge(obj1, obj2);
