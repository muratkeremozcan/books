function reverse(str) {
  let reversed = '';
  for (var i = str.length - 1; i >= 0; i--) { // start at last element, decrement to 0th
    reversed += str[i];
  }
  return reversed;
}
console.log(reverse('abcde'));
