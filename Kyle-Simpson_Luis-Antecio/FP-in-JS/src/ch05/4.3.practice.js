import { ifElse, cond, always, equals } from "ramda";
import R from "ramda";
import { isTruthy } from "ramda-adjunct";

const Maybe = require("folktale/maybe");

// not sure how to convert this, yet

const iValveOverviewData = {
  // heatingCoolingState: 'Heating'
  heatingCoolingState: "Cooling",
};

const HeatingCoolingState = {
  Heating: "Heating",
  // Cooling: 'Cooling',
};

function originalGetEnergyChartHeading() {
  let chartHeading = "";
  if (iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating) {
    chartHeading = "IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR";
  } else if (
    iValveOverviewData.heatingCoolingState === HeatingCoolingState.Cooling
  ) {
    chartHeading = "IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR";
  }
  return chartHeading;
}

const ternaryGetEnergyChartHeading = () =>
  iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating
    ? "IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR"
    : iValveOverviewData.heatingCoolingState === HeatingCoolingState.Cooling
    ? "IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR"
    : "";

// problem with these 2 is that we still want the '' case, not sure how to handle that yet

const maybeGetEnergyChartHeading = () =>
  Maybe.fromNullable(iValveOverviewData)
    .filter(
      (iValveState) =>
        iValveState.heatingCoolingState === HeatingCoolingState.Heating
    )
    .map(() => "IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR")
    .getOrElse("IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR");

const ifElseGetEnergyChartHeading = ifElse(
  () => iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating,
  () => "IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR",
  () => "IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR"
);

originalGetEnergyChartHeading(); //?

ternaryGetEnergyChartHeading(); //?

maybeGetEnergyChartHeading(); //?

ifElseGetEnergyChartHeading(); //?

/////////

// ramda-adjunct isTruthy
isTruthy(true); //?

// when
// Sometimes you only need the if statement, and the else simply returns the value unchanged.

const isEven = (num) => num % 2 === 0;

const doubleIfEven = (num) => {
  if (isEven(num)) {
    return num * 2;
  }
  return num;
};

doubleIfEven(100); //?
doubleIfEven(101); //?

// ternary
const doubleIfEvenTernary = (num) => (isEven(num) ? num * 2 : num);
doubleIfEvenTernary(100); //?

// using R.when, R.unless

const doubleIfEvenRamda = R.when(isEven, (num) => num * 2);
doubleIfEvenRamda(100); //?

const doubleIfOddRamda = R.unless(isEven, (num) => num * 2);
doubleIfOddRamda(101); //?

///

const someNum = 5;

const simpleIf = () => {
  if (someNum) {
    return someNum;
  }
};

simpleIf(); //?

const simpleIfTernary = () => {
  return someNum ? someNum : undefined;
};

simpleIfTernary(); //?

// const simpleIfRamda = R.when(
//   (arg) => arg != null,
//   (arg) => arg
// );
const simpleIfRamda = R.when(
  (arg) => arg != null,
  (arg) => arg
);

simpleIfRamda(someNum); //?

const status = "loading";
const isUpdating = false;

const spinner = () => {
  if (status === "loading" || isUpdating) {
    return "spinner";
  }
};
spinner(); //?

const spinner2 = R.unless(
  (s) => s === "loading" || isUpdating, //?
  R.always("spinner") //?
);

spinner2(status); //?

// cond

const findAnimal = cond([
  [equals("lion"), always("Africa and India")],
  [equals("tiger"), always("China, Russia, India, Vietnam, and many more")],
  [equals("hyena"), always("African Savannah")],
  [equals("grizzly bear"), always("North America")],
  [always(true), always("Not sure, try Googling it!")], // default case
]);

findAnimal("lion"); //?
