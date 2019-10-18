const fs = require('fs').promises;
const fileName = './phoneNumbers.txt';


const patternRegX = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'g');
const specialCharStripper = /[^\w]/g; // regex to eliminate anything that's not a letter or number

// // // because of asynchronous, 'data' can only be accessed inside the function
// async function findNumber(findPhoneNumber) {
//   try {
//     const result = await fs.readFile(fileName, 'utf-8');
//     console.log(result
//       .split('\n')
//       .filter(rawNumber => rawNumber.match(patternRegX)) // filter the array of phone numbers with regex
//       .map(filteredNumber => filteredNumber.replace(specialCharStripper, '')) // create a new array w/o special chars
//       .indexOf(findPhoneNumber.replace(specialCharStripper, ''))); // find the index of phone number input in any format
//   } catch(e) {
//     console.error(e);
//   }
// }
// findNumber('951.753.7890');



// IMPORTANT: Is there any way to flatten it after returning as opposed to console.logging within the function? YES!
async function findNumber(findPhoneNumber) {
  try {
    const inputNumber = findPhoneNumber.replace(specialCharStripper, '');
    const result = await fs.readFile(fileName, 'utf-8');
      return result
      .split('\n')
      .filter(rawNumber => rawNumber.match(patternRegX)) // filter the array of phone numbers with regex
      .map(filteredNumber => filteredNumber.replace(specialCharStripper, '')) // create a new array w/o special chars to compare with argument
      .indexOf(inputNumber); // find the index of phone number argument input in any format
  } catch(e) {
    console.error(e);
  }
}
// IMPORTANT: 3 ways to flatten a promise
findNumber('951.753.7890').then( (res) => { // CAN FLATTEN WITH .THEN
  console.log(res);
});

async function awaitfindNumberInAnotherAsyncFunc (number) { // AWAIT THE ASYNC FUNCTION IN ANOTHER ASYNC FUNCTION, AND THEN INVOKE THE FUNCTION
  console.log(await findNumber(number));
}
awaitfindNumberInAnotherAsyncFunc('951.753.7890');

(async function awaitfindNumberIIFE (number) { // IMMEDIATELY INVOKE AN ASYNC FUNCTION
  let finalResult = await findNumber(number);
  console.log(finalResult);
})('951.753.7890');

module.exports = findNumber;