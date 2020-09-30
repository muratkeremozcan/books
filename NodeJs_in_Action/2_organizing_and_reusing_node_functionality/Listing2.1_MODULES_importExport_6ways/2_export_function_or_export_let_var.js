const canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}
// exporting by object is similar
// shorthand for module.exports.myFunc = exports.myFunc
// exports.canadianToUS = canadian => roundTwoDecimals(canadian * canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
// exports.usToCanadian = us => roundTwoDecimals(us / canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside

export const canadianToUS = canadian => roundTwoDecimals(canadian * canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
export const usToCanadian = us => roundTwoDecimals(us / canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
