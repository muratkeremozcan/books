import _ from 'lodash';

// some practical uses of partial in the language

// you can partially apply .subString() starting at index 0 automatically, rather than having to specify 0
/** get first few chars in a string */
String.prototype.firstFew = _.partial(String.prototype.substring, 0);
'Functional Programming'.firstFew(3); //?
'Functional Programming'.substring(0, 3); //?

// partially apply regex to pre-specify the details
// Convert any name into a Last, First format
String.prototype.lastNameFirst = _.partial(String.prototype.replace, /(\w+)\s(\w+)/, '$2, $1');
'Murat Ozcan'.lastNameFirst(); //? 
'Murat Ozcan'.replace(/(\w+)\s(\w+)/, '$2, $1'); //? 

String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);
'ABC'.explode(); //?
'ABC'.match(/[\w]/gi); //?
