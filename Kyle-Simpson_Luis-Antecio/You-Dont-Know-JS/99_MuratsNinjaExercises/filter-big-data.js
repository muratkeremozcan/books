const data = require('./boatload.json');
const _ = require('lodash');

data.filter(data => data.url === 'https://siemens-qa-bt-015.eu.auth0.com/.well-known/jwks.json').length; //?


data.filter(data => _.uniqBy(data, data.url)).length; //?



const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
_.uniqWith(objects, _.isEqual); //?

data.length; //?
_.uniqBy(data, 'url').length; //?
_.uniqWith(data, _.isEqual).length; //?



// uniqBy from scratch

const sourceArray = [ 
  { id: 1, name: 'bob' },
  { id: 1, name: 'bill' },
  { id: 1, name: 'bill' } ,
  { id: 2,name: 'silly'},
  { id: 2,name: 'billy'}
];

function uniqBy (inputArray, callback) {
  return [...inputArray.reduce((map, item) => {
    const key = (item === null || item === undefined) ? item : callback(item); //?
    
    map.has(key) || map.set(key, item);
    
    return map;
  }, new Map()).values()];
}

const inputFunc = function (item) {
  return item.id
}

uniqBy(sourceArray, inputFunc); //?