import { interval } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

// Call a function when observable completes or errors
// signature: finalize(callback: () => void)
// finally is the dot notation

const source = interval(1000);

const example = source.pipe(
  take(5), //take only the first 5 values
  finalize(() => console.log('Sequence complete')) // Execute when the observable completes
)
const subscribe = example.subscribe(val => console.log(val));