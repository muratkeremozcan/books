// the idea is similar to 1.1_concurrency-conditional-check

var res = [];

function* reqData(url) {
  res.push(
    yield request(url)
  );
}

var it1 = reqData("http://some.url.1");
var it2 = reqData("http://some.url.2");

var p1 = it1.next();
var p2 = it2.next();

// KEY: the 2nd instance (p2) is given its data after the first instance (p1) finishes
p1
  .then(function (data) {
    it1.next(data);
    return p2;
  })
  .then(function (data) {
    it2.next(data);
  });

//////////////////

// `request(..)` is a Promise-aware Ajax utility

var res = [];

function *reqData(url) {
  var data = yield request(url);

  // transfer control
  yield;

  res.push(data);
}

var it1 = reqData("http://some.url.1");
var it2 = reqData("http://some.url.2");

var p1 = it.next();
var p2 = it.next();

// KEY: here, both instances receive their data as soon as their respective responses come back, 
// and then each instance yields; waits for it.next(data)
// We then choose what order to resume them in the Promise.all([ .. ]) handler.

p1.then(function (data) {
  it1.next(data);
});

p2.then(function (data) {
  it2.next(data);
});

Promise.all([p1, p2])
  .then(function () {
    it1.next();
    it2.next();
  });

//////////
// reusable utility

var res = [];

runAll(
  // (1) The first generator gets a promise for the first Ajax response from "http://some.url.1", 
  // then yields control back to the runAll(..) utility.
  function* () {
    var p1 = request("http://some.url.1");

    yield;

    // (3) the first generator resumes and yields its promise p1
    // (4) runAll utility waits for p1 to resolve, then resumes the same generator, res[0] is given a value
    res.push(yield p1);
  },
  // (2) The second does the same
  function* () {
    var p2 = request("http://some.url.2");

    yield;

    // (5) second generator resumes, yields promise p2 and waits for it to resolve
    // (6) runAll utility resumes the second generator with that value and res[1] is set
    res.push(yield p2);
  }
);


////////
// it might be quite helpful to further extend runAll(..) to provide an inner variable space for the multiple generator instances to share,

// the two generators are not just coordinating control transfer, but actually communicating with each other,
// both through data.res and the yielded messages that trade url1 and url2 values.

runAll(
  function* (data) {
    data.res = [];

    // transfer control (and message pass)
    var url1 = yield "http://some.url.2";

    var p1 = request(url1); // "http://some.url.1"

    // transfer control
    yield;

    data.res.push(yield p1);
  },
  function* (data) {
    // transfer control (and message pass)
    var url2 = yield "http://some.url.1";
    var p2 = request(url2); // "http://some.url.2"

    // transfer control
    yield;

    data.res.push(yield p2);
  }
);

