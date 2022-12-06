const credits = 60; // try 29, 60, 90

let yearIf = "senior";
if (credits < 30) {
  yearIf = "freshman";
} else if (credits <= 59) {
  yearIf = "sophomore";
} else {
  yearIf = "junior";
}

yearIf; //?

// Contrast this with the ternary operator:

const yearTernary =
  credits < 30
    ? "freshman"
    : credits <= 59
    ? "sophomore"
    : credits <= 89
    ? "junior"
    : "senior";

yearTernary; //?

// 2 conditions

const entityType = "boy";

const entityRoute2 = entityType === "hero" ? "heroes" : "villains";

entityRoute2; //?

const entityRoute3 =
  entityType === "hero"
    ? "heroes"
    : entityType === "villain"
    ? "villains"
    : `theboys`;

entityRoute3; //?

type Fruit = "apple" | "banana" | "grape";

let myFruit = "apple";

// user defined type guard
function isFruit(fruit: string): fruit is Fruit {
  return ["apple", "banana", "grape"].indexOf("fruit") !== -1;
}

if (isFruit(myFruit)) {
  // if this condition passes
  // then TS compiler knows that myFruit is of the Fruit type
  myFruit;
}

type EntityType = "hero" | "villain" | "boy";

const myEntity = "hero";

const isHero;
