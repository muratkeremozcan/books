let someValue: any = 'this is a string';

// Type assertion/ type casting is a way to tell the compiler "trust me, I know what I'm doing."
let strLength: number = (<string>someValue).length; //?