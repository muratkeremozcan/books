/**splits a string into an array of words */
export function words(str) {
  return String(str)
    .toLowerCase()
    .split(/\s|\b/)
    .filter(v => /^[\w]+$/.test(v));
}

/** takes a list of words and filters it to not have any repeat words in it */
export function unique(list) {
  var uniqList = [];
  for (let v of list) {
    // value not yet in the new list?
    if (uniqList.indexOf(v) === -1) {
      uniqList.push(v);
    }
  }
  return uniqList;
}
var text = "To compose two functions together, pass the \ output of the first function call as the input of the \ second function call.";

var wordsFound = words(text); //?
// To compose two functions together, pass the output of the first function call as the input of the second function call //  unique <-- wordsFound
var uniqueWordsFound = unique(wordsFound); //?
// uniqueWordsUsed <-- unique <-- words <-- text
var uniqueWordsFoundCondensed = unique(words(text)); //?

var uniqueWordsFoundLego = str => unique(words(str));
uniqueWordsFoundLego(text); //?

// Though we typically read the function calls left-to-right – unique(..) and then words(..) - 
// the order of operations will actually be more right-to-left, or inner-to-outer. words(..) will run first and then unique(..)


// utility to create a composition of two functions automatically. Functions compose right to left
function compose2 (fn2, fn1) {
  return function composed(value) {
    return fn2(fn1(value));
  }
}

var compose2_arrow = (fn2, fn1) => value => fn2(fn1(value));

var uniqueWords = compose2(unique, words);
uniqueWords(text); //?

