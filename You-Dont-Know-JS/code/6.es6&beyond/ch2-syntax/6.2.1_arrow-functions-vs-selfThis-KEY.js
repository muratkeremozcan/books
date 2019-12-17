// with var self = this









/** fulfillment returns 2, rejection returns 0 */
let controller_selfThis = {
  val: 1,
  rollDice: function () {
    var self = this;
    self.val; //?
    return new Promise(function (resolve, reject) {
      self.val; //?

      setTimeout(function () {
        self.val++;
        resolve(self.val);
      }, Math.random() * 1000);

      setTimeout(function () {
        self.val--;
        reject(self.val);
      }, Math.random() * 1000);
    });
  }
};

controller_selfThis.rollDice().then(
  function onFulfilled(promisedValue) {
    console.log(promisedValue);
  },
  function onRejected(reason) {
    console.log(reason);
  }
).catch(
  function (err) {
    console.log(err);
  }
)