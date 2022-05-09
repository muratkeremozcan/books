// https://dev.to/humblecoder00/comprehensive-big-o-notation-guide-in-plain-english-using-javascript-3n6m
{
  const { _ } = require("lodash");

  const range = 10; // increase to see the difference in scale
  const data = [_.range(0, range)];

  {
    // O(1) : constant; no matter how many items you need to operate with, amount of time needed to run the algorithm will be exactly the same
    const getFirst = (data: number[]) => data[0];
    getFirst(data); /*?.*/

    // O(5) : constant; per convention we call it O(1)
    const printFirstFive = (data: number[]) => {
      for (let i = 0; i < 5; i++) {
        console.log(data[i]);
      }
    };
    printFirstFive(data); /*?.*/

    // O(1) : Picking a value from an object via it's key is also an example of constant runtime.
    // No matter how many elements an object have, amount of time to pick the value is constant
    const todaysMenu = {
      breakfast: "Smoothie",
      lunch: "Salad",
      dinner: "Sushi",
    };
    const whatIsInTheMenu = (menu, meal) => menu[meal];
    whatIsInTheMenu(todaysMenu, "breakfast"); /*?.*/

    // O(1) : Functions like below are also an example for constant runtime algorithms.
    // No matter how big the numbers are, they follow a constant pattern
    const addTen = (n: number) => n + 10;
    const isEvenOrOdd = (n: number) => (n % 2 === 0 ? "even" : "odd");

    isEvenOrOdd(addTen(5)); //?
    isEvenOrOdd(addTen(6)); /*?.*/

    // some other examples of O(1): Arrays: push(), pop(), primitive math operations like sum, multiplication, subtraction, division, modulo
  }

  {
    // O(log n) : Logarithmic runtime usually applies to algorithms that divides problems in half every step
    // https://www.logcalculator.net/log-2
    // log2(5) = 32 : 2 to the power of what is 32? If there are 32 pieces of data, It would take at most 5 steps to get to the item being searched for

    ///// Comparison to linear runtime with O(n)
    // this O(n): data and time scale linearly
    const linearSearch = (data: number[], target: number) => {
      for (let i of data) {
        if (i === target) return `Found ${target} at index ${data.indexOf(i)}`;
      }
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i] === target) {
      //     return `Found the target: ${target} at index ${i}`;
      //   }
      // }
      return `${target} not found`;
    };

    linearSearch(data.flat(), 50); /*?.*/
    linearSearch(data.flat(), 5); /*?.*/
    linearSearch(data.flat(), 20); /*?.*/
    linearSearch(data.flat(), 25); /*?.*/

    const stylishLinearSearch = (data: number[], target: number) =>
      data.filter((n) => n === target)[0];

    // interestingly stylish search is slightly slower
    stylishLinearSearch(data.flat(), 50); /*?.*/
    stylishLinearSearch(data.flat(), 5); /*?.*/
    stylishLinearSearch(data.flat(), 20); /*?.*/
    stylishLinearSearch(data.flat(), 25); /*?.*/

    //// Compare O(n) with O(log n) :
    const binarySearch = (data: number[], target: number) => {
      let startIndex = 0;
      let endIndex = data.length - 1;

      while (startIndex <= endIndex) {
        let pivot = Math.floor((startIndex + endIndex) / 2);

        if (data[pivot] === target) {
          return `Found ${target} at index ${data.indexOf(pivot)}`;
        } else if (data[pivot] < target) {
          startIndex = pivot + 1;
        } else {
          endIndex = pivot - 1;
        }
      }
      return `${target} not found`;
    };

    // slightly faster when there is so much more data
    binarySearch(data.flat(), 50); /*?.*/
    binarySearch(data.flat(), 5); /*?.*/
    binarySearch(data.flat(), 20); /*?.*/
    binarySearch(data.flat(), 25); /*?.*/
  }

  {
    // O(n) : as data scales, time scales linearly
    const printArray = (data: number[]) => {
      for (let number of data) {
        console.log(number);
      }
    };

    printArray(data); /*?.*/
    /*
    Some examples to O(n) linear runtime algorithms:
  
    Print all the values in a list.
    Find a given element in a collection.
    Get the maximum or minimum value in an array.
    
    Some built-in Javascript methods with linear time complexity:
    Arrays: shift(), unshift(), splice(), concat(), slice(), indexOf(), forEach(), map(), filter(), reduce()
    */
  }

  {
    // O(n + n) : same var because both are the same value above, could be n + a if range was different
    const printArray = (data: number[]) => {
      for (let number of data) {
        console.log(number);
      }
      for (let number of data) {
        console.log(number);
      }
    };

    printArray(data); /*?.*/
  }

  {
    // O(n log n) : Linearithmic  time is a combination of O(n) and O(log n)
    // Sorting algorithms that utilize a divide and conquer strategy are Linearithmic, such as the following:
    // Merge sort, Quick sort, Heap sort, Time sort
    // data-structures-and-algorithms/4-merge-sort.ts
  }

  {
    // O(n^2) : Quadratic time
    // the curve starts getting bad here
    // 2 level nested loops, sorting array with bubble sort

    // for 3 elements, 3 * 3 = 9 pairs are printed
    const fruits = ["apple", "strawberry", "watermelon"];
    /* Output:  
    'apple - apple'
    'apple - strawberry'
    'apple - watermelon'
    'strawberry - apple'
    'strawberry - strawberry'
    'strawberry - watermelon'
    'watermelon - apple'
    'watermelon - strawberry'
    'watermelon - watermelon'
    */

    function logAllPairs(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          console.log(`${arr[i]} - ${arr[j]}`);
        }
      }
    }

    logAllPairs(fruits);

    // O(4n * n) : but the constant doesn't matter here, so it's still O(n^2)
    const measureTime = (data: number[]) => {
      for (let number1 of data) {
        for (let number2 of data) {
          console.log(number1 + number2);
          console.log(number1 + number2);
          console.log(number1 + number2);
          console.log(number1 + number2);
        }
      }
    };

    measureTime(data); /*?.*/

    {
      // O(n * n + n) : but we cut off the things that scale less, so it's still O(n * n)
      const measureTime = (data: number[]) => {
        for (let number1 of data) {
          for (let number2 of data) {
            console.log(number1 + number2);
          }
        }

        for (let number of data) {
          console.log(number);
        }
      };

      measureTime(data); /*?.*/
    }
  }

  /*
  What happens if we use 3 nested loops? Can it be still called Quadratic runtime? No. It will be called Cubic runtime, because we will be having O (n ^ 3) or O (n * n * n)
  To give you a better picture, functions having Quadratic, Cubic or similar run times are also called Polynomial time complexity. Which can be also shown as: O(n ^ k)

  n - input
  k - power of (2, 3, ... any)

  Keep in mind: bigger k value will make the algorithm slower. Cubic runtime algorithm will be a lot slower than Quadratic runtime.
  */
}

{
  // O(2^n) - Exponential time
  // recursion
  /*
  Calculations performed by an algorithm doubles every time as the input grows. 
  We can also say this is the opposite of Logarithmic runtime O(log n) - because on each step calculations are cut by half, while on Exponential it doubles. 
  Typical example for Exponential runtime is calculating Fibonacci numbers recursively
  */
  // memoization/3-recursion-memo.js
}

{
  // O(n!) - Factorial time (worst)
  // example: find all permutations of a given string

  // traveling salesman problem: find the shortest route that visits every city
  /*
  This is 3!, returns 6 different routes:
  [
    [ 'Copenhagen', 'Stockholm', 'Oslo' ],
    [ 'Copenhagen', 'Oslo', 'Stockholm' ],
    [ 'Stockholm', 'Copenhagen', 'Oslo' ],
    [ 'Stockholm', 'Oslo', 'Copenhagen' ],
    [ 'Oslo', 'Copenhagen', 'Stockholm' ],
    [ 'Oslo', 'Stockholm', 'Copenhagen' ]
  ]
  */

  function getPermutations(arr) {
    if (arr.length === 2) return [arr, [arr[1], arr[0]]];
    if (arr.length <= 1) return arr;

    return arr.reduce(
      (acc, item, i) =>
        acc.concat(
          getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(
            (val) => [item, ...val]
          )
        ),
      []
    );
  }

  const cities = ["Copenhagen", "Stockholm", "Oslo"];
  getPermutations(cities); /*?*/
}
