// interfaces are a powerful way of defining contracts within your code
// think of it as a layer over functions, specifying how to use them
// Sometimes called duck typing or structural typing


function printLabel(labelledObj: { label: string }) {
  return labelledObj.label;
}

let myObj = {
  size: 10, // not used
  label: 'Size 10 Object'
}

printLabel(myObj); //?


// you can do the same with an interface
interface LabelledValue {
  label: string;
  color?: string; // can have optional properties, just like optional parameters
  readonly y?: number; // can have readonly properties, which cannot be assigned
}
function printLabel2(labelledObj: LabelledValue) {
  return labelledObj.label;
}

printLabel2(myObj); //?

myObj.y = 5; // TS complaining
