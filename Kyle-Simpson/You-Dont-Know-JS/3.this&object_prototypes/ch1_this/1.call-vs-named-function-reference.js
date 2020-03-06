function foo(num) {
  console.log('foo :' + num);
  
  // named function foo is a reference that can be used to refer to the function from inside itself
  // foo.count++;

  // a more graceful approach is to embrace 'this' and not rely on named function
  // this here does not point to the function!! but to the global object, because the function is called from global scope
  // and a count property is created for the global object
  this.count++;  
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
  if (i > 5) {
    // foo(i); // won't work with 'this' reference, will work with named function

    // using call(..) we ensure that this points to the function itself
    // call invokes the method with specified 'this' context, with passed in parameter(s)
    foo.call(foo, i);
  }
}

foo.count; //?