// Value immutability means that when we need to change the state in our program, 
// we must create and track a new value rather than mutate an existing value

export function addValue(arr) {
  var newArr = [...arr, 4];
  return newArr
}
// [1,2,5] IS mutable, but we are not mutating it
addValue([1,2,5]); //?


// for objects, we can use the copy-instead-of-mutate strategy too
function updateLastLogin(user) {
  var newUserRecord = Object.assign({}, user);
  newUserRecord.lastLogin = Date.now();
  return newUserRecord;
}

var user = {
  name: 'Murat',
  lastLogin: 'yesterday'
}
updateLastLogin(user); //?

// user has not mutated!
user; //?