// labelled loops/blocks are extremely uncommon, and often frowned upon. 
 // It’s best to avoid them if possible; for example, by using function calls instead of the loop jumps.
 // But there are perhaps some limited cases where they might be useful. 
 // If you’re going to use a labeled jump, make sure to document what you’re doing with plenty of comments!


// 'foo' labelled loop
foo: for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    // whenever the loops meet, continue outer loop
    if (j == i) {
      // jump to the next iteration of the `foo` labeled-loop
      // instead of continuing the inner loop
      // this skips 1, 1 and 2, 2
      continue foo;
    }
    // this part is just to demo regular continue, you can disable this block to make it less confusing
    // skip odd multiples
    if ((j * i) % 2 == 1) {
      // normal (nonlabeled) 'continue' of inner loop
      // this only effects the case of 3, 1. If we have 3,1, continue the outer loop
      continue;
    }

    console.log(i, j);
  }
}

// without continue, you can use break

foob: for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    if ((i * j) >= 3) {
      console.log("stopping!", i, j);
      // break foob does not mean “go to the foob labeled position to continue,” but rather, 
        // “break out of the loop/block that is labeled foo and continue after it.” Not exactly a goto in the traditional sense,

      break foob;
    }

    console.log(i, j);
  }
}


function foor() {
  bar: {
    console.log('hello');
    break bar;
    console.log('never runs');
  }
  console.log('world')
}

foor();


// WTF..
// On the first line, {} appears in the + operator’s expression, and is therefore interpreted as an actual value
// [] is coerced to "" and thus {} is coerced to a string value as well: "[object Object]"
[] + {}; //?
// on the second line, {} is interpreted as a standalone {} empty block (which does nothing). 
  // Blocks don’t need semicolons to terminate them, so the lack of one here isn’t a problem. 
  // Finally, + [] is an expression that explicitly coerces (see Chapter 4) the [] to a number, which is the 0 value.
{} + []; //?