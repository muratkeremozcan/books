exports.addPercentageToEach = (prices, percentage) => { // adds percentage to array elements
  return prices.map((total) => {
    total = parseFloat(total);
    return total + (total * percentage);
  });
};
exports.sum = (prices) => { // calculates sum of array elements
  return prices.reduce((currentSum, currentValue) => {
    return parseFloat(currentSum) + parseFloat(currentValue);
  });
};
exports.percentFormat = (percentage) => { // formats percentage for display
  return parseFloat(percentage) * 100 + '%';
};
exports.dollarFormat = (number) => { // formats dollar value to display
  return `$${parseFloat(number).toFixed(2)}`; // method formats a number using fixed-point notation
};
