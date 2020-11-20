// add to beginning and end of an array

var array = ['a', 'b', 'c', 'd'];
var array2 = ['a', 'b', 'c', 'd']; // if you set this to 'array', they will share the reference and modify the original

array.push('end'); 
array.unshift('beginning');
console.log(array); //?

// with ES6 spread operator
array2 = ['beginning',...array2,'end'];
console.log(array2); //?



// create a private variable
function SecretVariable() {
  const _x = 'super secret code';

  let publicApi = {
    x: _x
  }
  return publicApi;

}

let secret = new SecretVariable();
secret.x; //?
secret._x //?


// what is the output? order of ops.
var num = 4;
function outer() {
  var num = 5; // 3rd precedence
  function inner() {
    num++; // 2nd precedence
    var num = 3; // 1st precedence
    console.log(num);
  }
  inner();
}
outer();

// what's the output
console.log(typeof typeof 1);


// what's the output
var hero = new Object({
  _name: 'John Doe',
  getSecretIdentity: function() {
    return this._name;
  }
});

// 'this' refers to the call site which is the hero object
hero.getSecretIdentity(); //?


// here the call site is global context, therefore the binding is global context and the result is undefined
var stoleSecretIdentity = hero.getSecretIdentity;
stoleSecretIdentity(); //?

// BIGGEST FRUSTRATION with JS with implicit binding (rule 2)
// !!implicit binding is lost when assigning a function to a variable or passing it as an argument to a function!!
// the binding falls back to the default binding: global object or undefined
// there are 4 fixes to this :  explicit binding by using apply, call, bind, or use arrow function

// how do you make it work
var boundStoleSecretIdentity = hero.getSecretIdentity.bind(hero);
boundStoleSecretIdentity(); //?


let thirdId =  hero.getSecretIdentity.apply(hero);
thirdId; //?

let fourthId = hero.getSecretIdentity.call(hero);
fourthId;

let secondIdentity = () => hero.getSecretIdentity();
secondIdentity(); //?


// reverse for loop
let vacationSpots = ['Paris', 'New York', 'Barcelona'];

function reverseArray(arr) {
  let newArray = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    newArray.push(arr[i]);
  }
  return newArray;
}

reverseArray(vacationSpots); //?

const reverseArrFunc = (arr) => arr.reduce((acc, str) => acc + `${str} `, '' );

reverseArrFunc(vacationSpots); //?


// function reverse(str){
//   return str.split("").reduce((rev, char)=> char + rev, ''); 
// }