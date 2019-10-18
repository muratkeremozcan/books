function capitalize(str) {
  // var firstLetter = str[0].toUpperCase(); // will error out if the string is undefined '' , so we use charAt() method
  var firstLetter = str.charAt(0).toUpperCase();
  var rest = str.slice(1).toLowerCase();
  return firstLetter + rest;
}
module.exports = capitalize;