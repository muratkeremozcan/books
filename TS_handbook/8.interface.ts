// interfaces are a powerful way of defining contracts within your code . Sometimes called duck typing or structural typing


let myObj = {
  size: 10,
  label: 'Size 10 Object'
}


function printLabel(labelledObj: { label: string }) {
  return labelledObj.label;
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


// Note: abstract class is very similar to an interface; the difference is that it is used for classes and can have access modifiers