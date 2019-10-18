var _ = require('lodash');
const fs = require('fs').promises;
const contactsJson = './contacts.json';


const patternRegX = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'g');
const specialCharStripper = /[^\w]/g; // regex to eliminate anything that's not a letter or number

// if you require JSON file, you can read it easily
// const jsonData = require('./phoneNumbers.json');
// console.log(jsonData);
// console.log(jsonData.Hattori);

async function findContactsNumber_diagNose() {
  try {
    const data = await fs.readFile(contactsJson, 'utf-8');
    // NOTE: you can read the data as a string
    console.log(data);
    console.log(typeof data); // as you read a json file, it is of string type

    // NOTE: you can parse the JSON data and convert it to an object
    const parsedFromJsonToObject = JSON.parse(data);
    console.log(typeof parsedFromJsonToObject); // object type
    console.log(parsedFromJsonToObject);
    console.log(parsedFromJsonToObject.Yoda); // querying and object key, for a value
    // NOTE: btw, to convert js object to a JSON, you can use JSON.stringify(obj)

    console.log(Object.entries(parsedFromJsonToObject));
    // NOTE: you can convert an object to map: JSON -> Object -> map
    const convertedFromObjectToMap = new Map(Object.entries(parsedFromJsonToObject));
    console.log(typeof convertedFromObjectToMap); // a map is of object type
    console.log(convertedFromObjectToMap);
    console.log(convertedFromObjectToMap.size);
    console.log(convertedFromObjectToMap.has('Yoshi'));
    console.log(convertedFromObjectToMap.get('Mariano'));

  } catch (e) {
    console.error(e);
  }
}
// findContactsNumber_diagNose();

async function findContactsNumber_iterateMap() {
  try {
    const data = await fs.readFile(contactsJson, 'utf-8');
    const parsedFromJsonToObject = JSON.parse(data);
    const convertedFromObjectToMap = new Map(Object.entries(parsedFromJsonToObject));

    // ITERATING though a MAP with for of
    for (let key of convertedFromObjectToMap.keys()) {
      console.log(key);
    }
    for (let value of convertedFromObjectToMap.values()) {
      console.log(value);
    }
    for (let contact of convertedFromObjectToMap) {
      console.log(contact);
    }
    // ITERATING through a MAP with forEach
    convertedFromObjectToMap.forEach((value, key, map) => {
      console.log(key);
      console.log(value);
      console.log(map);
    });

  } catch (e) {
    console.error(e);
  }
}
// findContactsNumber_iterateMap();
async function findContactsNumber(inputNumber) {
  try {
    const data = await fs.readFile(contactsJson, 'utf-8');
    const parsedFromJsonToObject = JSON.parse(data);
    // const convertedFromObjectToMap = new Map(Object.entries(parsedFromJsonToObject)); // can convert map to Object

    // console.log(parsedFromJsonToObject);
    const keys = Object.keys(parsedFromJsonToObject);
    const values = Object.values(parsedFromJsonToObject);
    const entries = Object.entries(parsedFromJsonToObject);
    // console.log(entries);
    // TESTING THIS
    entries.forEach(entry => {
      let name = entry[0];
      let number = entry[1];
      // console.log(number);
      let matchingNumber = number.match(patternRegX);
      // console.log(matchingNumber);
      if (matchingNumber == inputNumber) {
        console.log([name, matchingNumber]);
        // let filteredNumber = matchingNumber.replace(specialCharStripper, '');
        // console.log(filteredNumber);
        return [name, matchingNumber];
      }
    });
  
    // WORKING
    // return values
    //   .filter(rawNumber => rawNumber.match(patternRegX)) // filter the array of phone numbers with Regex
    //   .map(filteredNumber => filteredNumber.replace(specialCharStripper, '')) // create a new array w/o chars
    //   .indexOf(inputNumber); // find the index


  } catch (e) {
    console.error(e);
  }
}

findContactsNumber('+91 (977) 222-7890').then( result => {
  console.log(result);
});

// async function logContactIndex (number) {
//   console.log(await findContactsNumber(number));
// }
// logContactIndex('9517537890');
