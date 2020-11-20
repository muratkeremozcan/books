
// reverse each word in a string
var myString = "Welcome to this Javascript Guide!";

const reverseBySeparator = (str) => str.split(' ');

const wordReverse = (word) => word.split('').reverse().join('');

const reverseEachWord = (str) => reverseBySeparator(str).map(wrd => wordReverse(wrd));

reverseEachWord(myString); //?

reverseBySeparator(wordReverse(myString)); //?



// check if object is an array

var arrayList = [1 , 2, 3];

typeof arrayList; //?
Array.isArray(arrayList); //?


// How to empty an array in JavaScript
arrayList =  ['a', 'b', 'c', 'd', 'e', 'f']; //?

var anotherArrayList = arrayList;
// arrayList = []; // the copy anotherArrayList still retains itself this way
arrayList.length = 0; 

anotherArrayList; //?
arrayList; //?


// check if an item is an integer

const isInt = (num) => num % 1 === 0;
isInt(2.3); //?
isInt(5); //?


// Implement enqueue and dequeue using only two stacks
var inputStack = []; // First stack
var outputStack = []; // Second stack

function enqueue(stackInput, item) {
  return stackInput.push(...item);
}

function dequeue(stackInput, stackOutput) {
  if (!stackOutput.length) {
    while(stackInput.length) {
      var elementToOutput = stackInput.pop();
      stackOutput.push(elementToOutput);
    }
  }
  return stackOutput;
}

enqueue(inputStack, [1,2,3,4,5])
inputStack;

dequeue(inputStack, outputStack);  //?
outputStack; 



/// duplicate an array
const duplicate = (arr) => arr.concat(arr);
duplicate([1, 2, 3, 4, 5]); //?

// duplicate N times
const fiveItems = [1, 2, 3, 4, 5];
Array(3).fill(fiveItems); //?

const duplicateNTimes = (arr, n) => [].concat(...Array(n).fill(arr));
duplicateNTimes(fiveItems, 3); //?


// Write a "multiplication" function which will work properly when invoked as below syntax
// console.log(mul(2)(3)(4)); // output : 24

// from scratch
const scratchMul = x => y => z => x *y *z;
scratchMul(2)(3)(4); //?

const mul = (acc, curr) => acc * curr;
[1,2,3,4].reduce(mul); //?

// with curry
import { curry } from './fp-tool-belt.js';
const curriedMul = curry(mul);

curriedMul(2)(3); //?


// write a function that adds 6
const addSix = num => num + 6
addSix(6); //?



// Create a for loop that iterates up to 100 while outputting "fizz" at multiples of 3, 
// "buzz" at multiples of 5 and "fizzbuzz" at multiples of 3 and 5

function fizzBuzz(num) {
  for (let i = 1; i <= num; i++) {
    const fizz = () => i % 3 === 0;
    const buzz = () => i % 5 === 0;
    const fizzAndBuzz = () => fizz() && buzz();

    if (fizzAndBuzz()) {
      console.log('FizzBuzz');
    } 
    else if (fizz()) {
      console.log('Fizz');
    } 
    else if (buzz()) {
      console.log('Buzz');
    }
  }
}
fizzBuzz(15);


// Given two strings, return true if they are anagrams / palindrome of one another

const FIRST_WORD = "Mary";
const SECOND_WORD = "ARMY";

const isAnagram = (first, second) => {
  first = first.toLowerCase().split('').sort().join('');
  first; //?
  second = second.toLowerCase().split('').sort().join('');
  second
  
  return first === second;
}

isAnagram(FIRST_WORD, SECOND_WORD); //?



// check if arrays are equal 
const arr1 = [1, 2, 3, 4, 5]; 
const arr2 = [1, 2, 3, 4, 5];

JSON.stringify(arr1) === JSON.stringify(arr2); //?


// use a closure to create a private counter

function counter () {
  let _counter = 0;

  const publicApi = {
    add: (increment) => _counter += increment,
    retrieve: () => `The counter is currently at ${_counter}`
  }
  return publicApi;
}

let c = counter();

c.add(5); //?
c.add(9); //?
c.retrieve(); //?


// Find the Vowels “a”, “e”, “i”, “o”, “u”.

const findVowels = (str) => {
  let count = 0;
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  for (let char of str.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}  

findVowels('hello'); //?

const findVowelsRegex = (str) => {
  const matched = str.match(/[aeiou]/gi);
  return matched ? matched.length : 0;
}

findVowelsRegex('hello'); //?


const url = 'https://medium.com/@xiaoyunyang';
const getUserName = url => url.split('@').pop();

getUserName(url); //?

url; //?



// Write a Parentheses Checker function to determine if the input string’s opening and closing brackets are properly nested.

function balancedParentheses(str) {
  let stack = [];
  let map = {
    '(': ')',
    '[': ']',
    '{': '}'
  }

  for (let i = 0; i < str.length; i++) {
    // If character is an opening brace add it to a stack
    if (str[i] === '{' || str[i] === '[' || str[i] === '(') {
      stack.push(str[i]);
      stack; //?
    } 
    // if closing brace, pop from stack
    else {
      stack; //?
      let lastEle = stack.pop();
      // return false if the element popped doesn’t match the corresponding closing brace in the map 
      if (str[i] !== map[lastEle]) {
        return false;
      }
    }
  }
  stack; //?
  // if stack not empty at end, return false
  if (stack.length !== 0) {return false};

  return true;
}


balancedParentheses("{[]()}" ); //?
balancedParentheses("{[(])}"); //?
balancedParentheses("{[}"); //?



// remove first n items from an array

function removeFirstTwo(list) {
  const [, , ...remainingArr] = list;
  return remainingArr;
}

var arrLiteral = [8,9,10,11,12];
removeFirstTwo(arrLiteral); //?
arrLiteral; //?

const removeFirstN = (list, n) => list.filter((list, idx) => idx >= n);

removeFirstN(arrLiteral, 2); //?

arrLiteral; //?



// Destructure undefined
function pointValues(point) {
  const { name: n, age: a } = {...point};
  return {n, a};
}

pointValues({name:"jerry", age:2}); //?



// remove evens from an array
const arrayLiteral = [1,2,4,5,10,6,3];



const isOdd = (i) => i % 2 === 1;

// boring version...
const removeEven = (arr) => {
  let odds = [];

  for (let i of arr) {
    if(isOdd(i)) {
      odds.push(i);
    }   
  }
  return odds;
};
removeEven(arrayLiteral); //?


const removeEvenFunc = (arr) => arr.filter(isOdd); 

removeEvenFunc(arrayLiteral); //?
