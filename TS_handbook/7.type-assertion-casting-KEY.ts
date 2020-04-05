let someValue: any = 'this is a string';

// Type assertion/ type casting is a way to tell the compiler "trust me, I know what I'm doing."
let strLength: number = (<string>someValue).length; //?
typeof someValue; //?
typeof strLength; //?

// double type assertion / type casting
function handler(event: Event) {
  // let element = event as HTMLElement; // Error: Neither 'Event' nor type 'HTMLElement' is assignable to the other
  // if you still want the type as HTMLElement , you can first assign to any , then HTMLElement 
  let elementb = event as any as HTMLElement; // Okay!
  let otherElement = <HTMLElement><any> event;
}
