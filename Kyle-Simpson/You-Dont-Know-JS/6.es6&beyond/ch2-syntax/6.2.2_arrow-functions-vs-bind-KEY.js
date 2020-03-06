//// with bind









/** fulfillment returns 2, rejection returns 0 */
let controller_bind = {
  val: 1,
  rollDice: function () {
   
    this.val; //?
    return new Promise(function (resolve, reject) {
      this.val; //?

      setTimeout(function () {
        this.val++;
        resolve(this.val);
      }.bind(this), Math.random() * 1000);

      setTimeout(function () {
        this.val--;
        reject(this.val);
      }.bind(this), Math.random() * 100);
    }.bind(this));
  }
};

controller_bind.rollDice().then(
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