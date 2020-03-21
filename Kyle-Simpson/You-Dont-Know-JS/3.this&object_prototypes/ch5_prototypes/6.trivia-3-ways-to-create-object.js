// 3 ways to create an object
var task = {};
// var task = Object.create(Object.prototype);
// var task = new Object();

task.title = 'My task';
task.description = 'My description';
task.toString = function() { // cannot use () => here, function is already 'this' aware
  return this.title + ' ' + this.description
}
// arrow functions keep the lexical scope. If you instead used 'this' for 'obj' , it would not know what 'this' is
const toStringArrow = (obj) => (obj.title + ' ' + obj.description);

task
task.toString(); //?
toStringArrow(task); //?