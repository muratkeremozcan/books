function* Gen (val){
  val = yield val * 2; // i
  console.log(val);
  yield val;
}

let iterator = Gen(2); // iterator assigned

let a1 = iterator.next(3).value; // the first passed in value is ignored because there is no waiting yield expression
console.log(a1);

let  a2 = iterator.next(5).value; // passing in a value now will cause the waiting yield expression to get the value (yield val * 2 = 5)
console.log(a2);