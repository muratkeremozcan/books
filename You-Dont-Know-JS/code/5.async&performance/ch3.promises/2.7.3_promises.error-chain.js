// What if something went wrong in one of the steps of the Promise chain? 
 //An error/exception is on a per-Promise basis, which means it’s possible to catch such an error at any point in the chain,
 // and that catching acts to sort of “reset” the chain back to normal operation at that point:

// When the error occurs in step 2, the rejection handler in step 3 catches it. 
// The return value (42 in this snippet), if any, from that rejection handler fulfills the promise for the next step (4),
//  such that the chain is now back in a fulfillment state.


// step 1:
request("http://some.url.1/")

  // step 2:
  .then(function (response1) {
    foo.bar(); // undefined, error!

    // never gets here
    return request("http://some.url.2/?v=" + response1);
  })

  // A thrown exception inside either the fulfillment or rejection handler of a then(..) call 
    // causes the next (chained) promise to be immediately rejected with that exception.

  // step 3:
  .then( // error got passed
    function fulfilled(response2) {
      // never gets here
    },
    // rejection handler to catch the error
    function rejected(err) {
      console.log(err);
      // `TypeError` from `foo.bar()` error
      return 42;
    }) 

  // step 4:
  .then(function (msg) { // rejection handler passed in 42
    console.log(msg);     // 42
  });
