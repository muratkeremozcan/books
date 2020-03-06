function foo() {
  function bar(a) {
      i = 3; // changing the `i` in the enclosing scope's
             // for-loop
      console.log( a + i );
  }

  for (var i=0; i<10; i++) { // use let, or rename i to something else either here or above
      bar( i * 2 ); // oops, infinite loop ahead!
  }
}

foo();