// STATIC and instance members

// create an instance of the class and access the class member method doSomething()
class MyClass {
  doSomething(): void {
    console.log('do something');
  }
}

const mc = new MyClass();
mc.doSomething();

// If a class property or method were declared with the static keyword, its values
// would be shared between all instances of the class, and you wouldn’t need to create
// an instance to access static members. Instead of using a reference variable (such
// as mc), you’d use the name of the class

class MyClass_staticExample {
  static doSomething(numberOfTimes): void {
    console.log(`do something with static ${numberOfTimes} times`);
  }
}

MyClass_staticExample.doSomething(5);

const mc_staticExample = new MyClass_staticExample();
// mc_staticExample.doSomething(); // this wouold not work because the method is static