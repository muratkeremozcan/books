// 3 ways of binding to address the  loss of implicit this binding on inner functions * cool() function
// happens when assigning functions to variables or passing them in as callbacks

// ES6 arrow
var obj = {
  count: 0,
  cool: function coolFn() {

    if (this.count < 1) {
      setTimeout(() => {
        // arrow-function ftw
        this.count++;
        console.log("awesome?");
      }, 100);
    }
  }
};

obj.cool(); // awesome?

//////////////////
// 2nd way (pre ES6)
// var self = this
var obj2 = {
  count: 0,
  cool: function coolFn() {
    var self = this;

    if (self.count < 1) {
      setTimeout(function timer() {
        self.count++;
        console.log("awesome?");
      }, 100);
    }
  }
};

obj2.cool();

// 3rd way
// bind()  (pre ES6)
var obj3 = {
  count: 0,
  cool: function coolFn() {

    if (this.count < 1) {
      setTimeout(function timer() {
          this.count++; // `this` is safe because of `bind(..)`
          console.log("more awesome");
        }.bind(this),
        100
      ); // look, `bind()`!
    }
  }
};

obj3.cool(); // more awesome
