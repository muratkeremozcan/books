{
  function *foo() { 
    try { 
      yield 1; 
      yield 2; 
      yield 3;
    }
    finally {
      console.log('cleanup')
    }
  }

  let it = foo();
  it.next(); //?

  // return(x) is kind of like forcing a return x to be processed at exactly that moment, such that you get the specified value right back.
  // The purpose of this capability is to notify the generator if the controlling code is no longer going to iterate over it anymore, so that it can perhaps do any cleanup tasks
  it.return(42); //?
  it.next(); //?
}


{
  // Identical to a normal function cleanup pattern, the main way to accomplish this is to use a finally clause:
  function *bar() { 
    try { 
      yield 1; 
      yield 2; 
      yield 3;
    }
    finally {
      console.log('cleanup')
    }
  }
  for (let v of bar()) {
    console.log(v);
  }
  
  // a generator produces a whole new iterator each time it’s called. In fact, you can use multiple iterators attached to the same generator concurrently:
  let it1 = bar();
  it1.next(); //?
  it1.return(42); //?

  let it2 = bar();
  it2.next(); //?
  it2.next(); //?
  it2.return(5); //?
}

{ // throw produces the same sort of early completion that aborts the generator’s run at its current pause point.
  function *foo() {
    yield 1;
    yield 2;
    yield 3;
  }
  var it = foo(); 
  it.next(); //?

  try {
    it.throw('oops');
  } catch (e) {
    console.log(e);
  }
  // after throw, execution stops. return instead of throw would be the same behavior with the lack of exception handling (no error block)
  it.next(); //?
  // if a try.. finally clause was waiting inside the generator when you call throw(..), the finally clause would be given a chance to complete
}