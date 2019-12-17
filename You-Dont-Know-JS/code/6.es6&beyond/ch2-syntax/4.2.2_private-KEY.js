// Trivia: how would you hide _id? make it private?
// ES6
class o_ES6 {
  constructor() {
    let _id = 10;
    this.getId = function() {
      return _id++; //?
    };
    this.setId = function(v) {
      return _id = v; //?
    }
  }
}
let o = new o_ES6();

o.getId(); //?
o.setId(20); //?
o._id; //?

///////////
// ES5
function o_ES5() {
  let _id = 10
  this.getId = function() {
    return _id++; //?
  };
  this.setId = function(v) {
    return _id = v; //?
  }
}

let p = new o_ES5(60);
p.getId(); //?
p.setId(20); //?
p._id; //?


//////////
//using an API pattern

function secretIdMaker() {
  let _id = 10;

  let publicAPI = {
    getId: _id++,
    setId(v) {
      return _id = v;
    }
  }
  return publicAPI;
}

let secretId = new secretIdMaker();
secretId.getId; //?
secretId.setId(20); //?
secretId._getId; //? 

