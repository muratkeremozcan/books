// pipe(..) is identical to compose(..) except it processes through the list of functions in left-to-right order
// this way we do not have to use partialRight(compose, ..) to setup the upcoming functions at the initial spot to execute in the composition.
import { skipShortWords, skipLongWords, text } from './1.2-compose-many';
import { unique, words } from './1.1.words-unique-compose';
import { compose, partialRight, partial } from '../fp-tool-belt';

function pipe(...fns) { 
  return function piped(result){ 
    var list = [...fns]; 
    while (list.length > 0) { // take the first function from the list and execute it 
      result = list.shift()(result); 
    } 
    return result; 
  }; 
}
// alternative: pipe = reverseArgs(compose);


//// compose vs pipe

// compose
var filterWordsCompose = partialRight(compose, unique, words);

// compose(skipShortWords, unique, words)(text); //?
filterWordsCompose(skipShortWords)(text); //?  


// pipe()
var filterWordsPipe = partial(pipe, words, unique);
// pipe(words, unique, skipShortWords)(text); //?
filterWordsPipe(skipShortWords)(text); //?


