import { addValue } from './1_copy-instead-of-mutate-KEY';

// Non-primitive values (arrays, objects, functions) are held by reference,  
// when passed as arguments, it’s the reference that’s copied, not the value itself.
// If you have an object or array in one part of the program, and pass it to a function that resides in another part of the program, 
// that function can now affect the value via this reference copy, mutating it in possibly unexpected ways.


function foo(arr) {
  arr.unshift(10);
  return arr;
}

{ // the function may mutate the array, using the reference copy you pass to it!
  let arr = [1, 2, 3];
  foo(arr); //?
  
  arr; //?
}

{ // to work around reference copy, wrap the argument in array and spread it
  let arr = [1, 2, 3];
  foo([...arr]); //?
  
  arr; //?
}

//////////
// question: how do you do the same with object?

function addLastName(obj){
  obj.lastName = 'Ozcan';
  return obj;
}

{ // function mutates the object, using the reference copy you pass to it
  let user = {
    name: 'Murat',
    lastLogin: 'yesterday'
  }
  addLastName(user); //?

  user; //?
}

{ // idea fom 2.2_purifying-fn-mutates-free-variables.js 
  let user = {
    name: 'Murat',
    lastLogin: 'yesterday'
  }

  function safer_addLastName(user) {
    // create a local copy
    // user = Object.assign({}, user);  // use Object assign with ES6-
    user = {...user}; // use object spread ES2018
    addLastName(user); // call local copy
    return user;
  }
  safer_addLastName(user); //?

  user; //?
}

