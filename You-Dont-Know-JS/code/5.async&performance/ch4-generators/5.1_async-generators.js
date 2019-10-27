
function foo(x, y) {
  ajax("http://some.url.1/?x=" + x + "&y=" + y,
    function (err, data) {
      if (err) {
        // throw the error  to main
        it.throw(e);
      }
      else {
        // resume main with received data
        it.next(data);
      }
    }
  )
}

function* main() {
  try {
    // TL,DR; the yield here stops execution, calls foo.
      // foo returns a value with it.next(data). That data becomes the result of 'yield', gets assigned to text

    // the yield in the generator gives us stopping, synchronous code we need
    // We’re not using yield in a message passing sense here, only in a flow control sense to pause/block.
    // “what value should I return to assign to the variable text?” Who’s going to answer that question? 
      // Look at foo(..). If the Ajax request is successful, we call: it.next( data );
      // That’s resuming the generator with the response data, which means that our paused yield expression receives that value directly, 
      // and then as it resumes the generator code, and that value gets assigned to the local variable text.
    var text = yield foo(11, 31);
    console.log(text);
  }
  // the yield pausing also allows the generator to catch an error. We throw that error into the generator with 'it.throw(e)
  // Not only do we get synchronous-looking return values from async function calls, 
  // but we can also synchronously catch errors from those async function calls!
  // Additionally, we can throw those errors out of the generator
  catch (err) {
    console.log(err);
  }               
}

var it = main();

// (1) when starting the generator, foo(11, 31) is called / yielded
it.next();

// WHY IS THIS IMPORTANT? We have totally synchronous-looking code inside the generator (other than the yield keyword itself), 
// but hidden behind the scenes, inside of foo(..), the operations can complete asynchronously.
