export default function samplePromise(x) {
  return new Promise(
    function (resolve, reject) {

      setTimeout(function () {
        resolve(x);
      }, Math.random() * 1000);

      // setTimeout(function () {
      //   reject('rejector kicked in');
      // }, 600);

    });
}