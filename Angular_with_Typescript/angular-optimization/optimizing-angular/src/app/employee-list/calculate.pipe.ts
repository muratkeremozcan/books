import { Pipe, PipeTransform } from '@angular/core';

// (3) Memoization is possible for pure functions
// it is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls
// and returning the cached result when the same inputs occur again
// (3.1) use the memo-decorator package
import memo from 'memo-decorator';

// (2) move your pure calculations to pure pipes
const fibonacci = (num: number): number => {
    if (num === 1 || num === 2) {
      return 1;
    }
    return fibonacci(num - 1) + fibonacci(num - 2);
  };

@Pipe({
  name: 'calculate'
  // pure: true // by default pipes are pure
})
export class CalculatePipe implements PipeTransform {
  // (3.2) apply the memo decorator to the pipe transform method
  @memo()
  transform(value: any): any {
    console.log('calculating', value);
    return fibonacci(value);
  }

}
