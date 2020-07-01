/////
// inline annotations do the same thing, but interfaces are extendible
// declare var myPoint: { x: number; y: number; };

interface Point {
  x: number; y: number;
}

interface Point {
  z: number;
}
declare var yourPoint: Point;

// interfaces with classes
// If you want to use classes that must follow an object structure that someone declared for you
// in an interface you can use the implements keyword to ensure compatibility:

declare class MyPointClass implements Point {
  x: number;
  y: number;
  z: number;
}
declare var myClassPoint: MyPointClass;