const canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

// 2 properties of the exports object is set, the applications that includes this module can only access these functions
// exporting by object is similar
exports.canadianToUS = canadian => roundTwoDecimals(canadian * canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
exports.usToCanadian = us => roundTwoDecimals(us / canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside

// export let canadianToUS = canadian => roundTwoDecimals(canadian * canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
// export let usToCanadian = us => roundTwoDecimals(us / canadianDollar); // function is set in EXPORTS MODULE, so it can be used outside
