
var o = {
  _id: 10,
  get id() {
    return this._id++; //?
  },
  set id(v) {
    this._id = v; //?
  }
}
o.id; //?
o.id; //?
// IMPORTANT: asking for  _id instead of id , does not trigger the get function!
o._id; //?
o._id; //?
o.id; //?

o.id = 20
o.id; //?
// same comment
o._id; //?
o._id; //?
o.id; //?
o.id; //?




// Trivia: how would you hide _id? make it private?
// class p {
//   _id = 10;
//   get id() {
//     return this._id++; //?
//   };
//   set id(v) {
//     this._id = v; //?
//   }
// }
