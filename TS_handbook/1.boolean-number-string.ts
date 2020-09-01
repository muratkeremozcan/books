function add(n1: number, n2: number, showResult?: boolean) {
  const result = n1 + n2;
  if (showResult) {
    console.log(`the result is ${result}`);
  } else
    return result;
}

add(3, 4, true);
// TS doing its job
add('3', 4); //?