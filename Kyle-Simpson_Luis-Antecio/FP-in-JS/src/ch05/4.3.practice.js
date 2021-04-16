import { ifElse } from 'ramda';
const Maybe = require('folktale/maybe');

// not sure how to convert this, yet

const iValveOverviewData = {
  // heatingCoolingState: 'Heating'
  heatingCoolingState: 'Cooling'
}

const HeatingCoolingState = {
  Heating: 'Heating',
  // Cooling: 'Cooling',
}

function originalGetEnergyChartHeading() {
  let chartHeading = '';
  if (iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating) {
    chartHeading = 'IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR';
  } else if (iValveOverviewData.heatingCoolingState === HeatingCoolingState.Cooling) {
    chartHeading = 'IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR';
  }
  return chartHeading;
}

const ternaryGetEnergyChartHeading = () =>
  iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating
    ? 'IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR'
    : iValveOverviewData.heatingCoolingState === HeatingCoolingState.Cooling
      ? 'IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR'
      : '';


// problem with these 2 is that we still want the '' case, not sure how to handle that yet

const maybeGetEnergyChartHeading = () =>
  Maybe.fromNullable(iValveOverviewData)
    .filter(iValveState => iValveState.heatingCoolingState === HeatingCoolingState.Heating)
    .map(() => 'IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR')
    .getOrElse('IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR');


const ifElseGetEnergyChartHeading = ifElse(
  () => (iValveOverviewData.heatingCoolingState === HeatingCoolingState.Heating),
  () => 'IVALVE_OVERVIEW.HEATING_ENERGY_PER_HOUR',
  () => 'IVALVE_OVERVIEW.COOLING_ENERGY_PER_HOUR'
);

originalGetEnergyChartHeading(); //?

ternaryGetEnergyChartHeading(); //?

maybeGetEnergyChartHeading(); //?

ifElseGetEnergyChartHeading(); //?