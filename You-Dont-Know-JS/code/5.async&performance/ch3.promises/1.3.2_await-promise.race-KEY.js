async function makeAPromiseWithValue(value) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(value);
      }, Math.random() * 1000);

      setTimeout(function () {
        reject('rejector kicked in hoh');
      }, 300); // change the value to simulate rejection

    });
}
 
const promise1 = makeAPromiseWithValue('First');
const promise2 = makeAPromiseWithValue('Second');
const promise3 = makeAPromiseWithValue('Third');

try { 
  await Promise.race([promise1, promise2, promise3]); //?
}
catch (e) {
  console.log(e);
}   