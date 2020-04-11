const infectionsByRequestedTime = (data, currentlyInfected) => {
  let infections;
  let periodInDays;
  let unitSet;
  switch (data.periodType) {
    case 'weeks':
    case 'week':
      periodInDays = data.timeToElapse * 7;
      unitSet = Math.floor(periodInDays / 3);
      infections = currentlyInfected * 2 ** unitSet;
      break;
    case 'months':
    case 'month':
      periodInDays = data.timeToElapse * 30;
      unitSet = Math.floor(periodInDays / 3);
      infections = currentlyInfected * 2 ** unitSet;
      break;
    default:
      unitSet = Math.floor(data.timeToElapse / 3);
      infections = currentlyInfected * 2 ** unitSet;
      break;
  }
  return infections;
};

const hospitalBedsByRequestedTime = (data, severeCases) => {
  const availableBeds = Math.trunc(data.totalHospitalBeds * 0.35);
  return availableBeds - severeCases;
};

const dollarsInFlight = (data, infections) => {
  let totalDollars;
  let timeInDays;
  const { avgDailyIncomePopulation } = data.region;
  const { avgDailyIncomeInUSD } = data.region;
  switch (data.periodType) {
    case 'weeks':
    case 'week':
      timeInDays = data.timeToElapse * 7;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
    case 'months':
    case 'month':
      timeInDays = data.timeToElapse * 30;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
    default:
      timeInDays = data.timeToElapse;
      totalDollars = infections * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeInDays;
      break;
  }
  return totalDollars;
};

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  // Challenge 1 task a
  impact.currentlyInfected = data.reportedCases * 10;

  // Challenge 1 task b
  severeImpact.currentlyInfected = data.reportedCases * 50;

  // Challenge 1 task c
  impact.infectionsByRequestedTime = infectionsByRequestedTime(data, impact.currentlyInfected);
  severeImpact.infectionsByRequestedTime = infectionsByRequestedTime(data, severeImpact.currentlyInfected);

  //   Challenge 2 task a
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);
  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.15);

  //    challenge 2 task b
  impact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime(data, impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTime(data, severeImpact.severeCasesByRequestedTime);

  //  Challenge 3 task a
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  // Challenge 3 task b
  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  // Challenge 3 task c
  impact.dollarsInFlight = dollarsInFlight(data, impact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = dollarsInFlight(data, severeImpact.infectionsByRequestedTime);
  return { data, impact, severeImpact };
};
export default covid19ImpactEstimator;
