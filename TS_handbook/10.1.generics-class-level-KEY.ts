// the goal of generics is to document the type dependencies between members:
// class methods & properties, function arguments and return values

// ex: first in first out data structure implementation
class Queue {
  protected data = [];
  push(item) {
    this.data.push(item);
  }
  pop() {
    return this.data.pop();
  }
}

const queue = new Queue();
queue.push(0);
queue.push(1);
queue.push(2);
queue; //?
queue.pop(); //?
queue; //?

// problem: any type of data can be pushed and popped.
// if you want specific data checking, you have to have a child class per data type

class QueueNumber extends Queue {
  push(item: number) {
    this.data.push(item);
  }
  pop(): number {
    return this.data.pop();
  }
}
const queueNumber = new QueueNumber();
queueNumber.push(5);
queueNumber; //?
queueNumber.pop(); //?
queueNumber;
// the problem is you need a child class per type!


// What you really want is a way to say that whatever the type is of the stuff getting pushed 
// it should be the same for whatever gets popped.
// This is done easily with a generic parameter(in this case, at the class level):


// (1) Generics at class level (class methods and properties)

class QueueG<T> {
  protected data: T[] = [];
  push(item: T) {
    this.data.push(item);
  }
  pop(): T {
    return this.data.pop();
  }
}
const queueN = new QueueG<number>();
queueN.push(0);
queueN.push(1);
// TS complains
queueN.push('5'); //?

const queueS = new QueueG<string>();
queueS.push('0');
queueS.push('1');
// TS complains
queueS.push(5);
