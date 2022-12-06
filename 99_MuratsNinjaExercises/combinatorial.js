const keys = [
  "isBold",
  "emphasis",
  "size",
  "color",
  "fillContainer",
  "iconPosition",
  "isDisabled",
  "isProcessing",
  "isInverted",
  "isForceActive",
];

const values = [
  [true, "low", "xsmall", "blue", true, "left", true, true, true, true],
  [
    false,
    "medium",
    "small",
    "blue",
    false,
    "right",
    false,
    false,
    false,
    false,
  ],
  [true, "high", "regular", "blue", false, "left", false, true, false, true],
  [false, "low", "large", "blue", true, "right", true, false, true, false],
  [true, "medium", "xsmall", "green", false, "right", true, true, false, false],
  [false, "high", "small", "green", true, "left", false, false, true, true],
  [false, "low", "regular", "green", false, "right", true, true, true, false],
  [true, "medium", "large", "green", true, "left", false, false, false, true],
  [
    false,
    "high",
    "xsmall",
    "neutral",
    false,
    "right",
    true,
    false,
    true,
    false,
  ],
  [true, "low", "small", "neutral", true, "left", false, true, false, true],
  [
    false,
    "medium",
    "regular",
    "neutral",
    true,
    "left",
    true,
    false,
    true,
    true,
  ],
  [true, "high", "large", "neutral", false, "left", false, true, false, true],
  [false, "low", "xsmall", "yellow", true, "right", false, false, false, true],
  [true, "medium", "small", "yellow", false, "left", true, true, true, false],
  [true, "high", "regular", "yellow", true, "right", false, false, true, true],
  [false, "medium", "large", "yellow", true, "left", true, false, false, true],
  [false, "low", "xsmall", "red", true, "right", false, false, false, true],
  [true, "medium", "small", "red", false, "left", true, true, true, false],
  [true, "high", "regular", "red", false, "left", true, true, false, true],
  [false, "medium", "large", "red", false, "left", false, false, true, true],
];

// const combinations = values.reduce(
//   (acc, value) => {
//     const result = acc.map((combination) => {
//       return keys.reduce((keyAcc, key, index) => {
//         return {
//           ...keyAcc,
//           [key]: value[index],
//         };
//       }, combination);
//     });
//     return [...acc, ...result];
//   },
//   [{}]
// );

// combinations; //?

// const combinations2 = values.reduce(
//   (acc, value) => {
//     const result = acc.map((combination) =>
//       keys.reduce(
//         (keyAcc, key, index) => ({
//           ...keyAcc,
//           [key]: value[index],
//         }),
//         combination
//       )
//     );
//     return [...acc, ...result];
//   },
//   [{}]
// );

// Object.assign(myObject, keys);

const superFunc = (variant) => {
  const myObject = new Map([
    [keys[0], values[variant][0]],
    [keys[1], values[variant][1]],
    [keys[2], values[variant][2]],
    [keys[3], values[variant][3]],
    [keys[4], values[variant][4]],
    [keys[5], values[variant][5]],
    [keys[6], values[variant][6]],
    [keys[7], values[variant][7]],
    [keys[8], values[variant][8]],
    [keys[9], values[variant][9]],
  ]);

  return Object.fromEntries(myObject);
};


const testCase = Array.from(Array(10).keys()).map((variant) => superFunc(variant)); //?
