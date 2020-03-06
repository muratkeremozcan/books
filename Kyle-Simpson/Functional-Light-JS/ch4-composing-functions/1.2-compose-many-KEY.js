import { unique, words } from './1.1.words-unique-compose';
import { partialRight} from '../fp-tool-belt';
/////
// general compose


function compose(...fns) {
  return function composed(result) {
    // copy the array of functions
    var list = [...fns];
    while (list.length > 0) {
      // take the last function off the end of the list and execute it
      result = list.pop()(result);
    }
    return result;
  }
}
var compose_arrow = (...fns) => result => {
  let list = [...fns];
  while (list.length > 0) {
    result = list.pop()(result);
  }
  return result
}


// usage

export var text = "To compose two functions together, pass the \ output of the first function call as the input of the \ second function call.";

export function skipShortWords(words) {
  var filteredWords = [];
  for (let word of words) {
    if (word.length > 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
}

export function skipLongWords(words) {
  var filteredWords = [];
  for (let word of words) {
    if (word.length <= 4) {
      filteredWords.push(word);
    }
  }
  return filteredWords;
}

var biggerWords = compose(skipShortWords, unique, words);

var wordsUsed = biggerWords(text); //?

/// 
// We can build a right-partial application of compose(..) itself, 
// pre-specifying the second and third arguments (unique(..) and words(..), respectively);
// right-partial application on compose(..) gives us the ability to specify ahead of time the first step(s) of a composition, 
// and then create specialized variations of that composition with different subsequent steps (biggerWords(..) and shorterWords(..)).

var filterWords = partialRight(compose, unique, words);

var biggerWords = filterWords(skipShortWords);  //  compose(skipShortWords, unique, words)
var shorterWords = filterWords(skipLongWords);  //  compose(skipLongWords, unique, words)

biggerWords(text); //?
shorterWords(text); //?

// TODO: when reduce is covered in ch 8, come back to alternative versions of compose in ch4