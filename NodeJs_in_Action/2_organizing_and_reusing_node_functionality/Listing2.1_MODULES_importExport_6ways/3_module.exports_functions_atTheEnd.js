const canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

let canadianToUS = canadian => roundTwoDecimals(canadian * canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
let usToCanadian = us => roundTwoDecimals(us / canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside

// exporting in 2 ways is similar
// export { canadianToUS, usToCanadian };
module.exports = { canadianToUS, usToCanadian };