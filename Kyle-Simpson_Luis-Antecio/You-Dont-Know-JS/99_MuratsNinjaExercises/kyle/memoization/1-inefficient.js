function inefficientSquare(n) {
  let result = 0;
  for (let i = 0; i < n; i++) {
    for (let j = -0; j < n; j++) {
      result += 1;
    }
  }
  return result;
}

// slow and inefficient
inefficientSquare(3000); /*?.*/
inefficientSquare(3000); /*?.*/
inefficientSquare(3000); /*?.*/
inefficientSquare(3000); /*?.*/
