for (let index = 1; index <= 100; index++) {
  let result = "";

  if (index % 3 == 0) result += "Fizz";
  if (index % 5 == 0) result += "Buzz";

  if (result == "") result = index.toString();

  console.log(result);
}
