import { Pipe, PipeTransform } from '@angular/core';

const fibonacci = (num: number): number => {
  if (num === 1 || num === 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
};

@Pipe({
  name: 'calculate'
})
export class CalculatePipe implements PipeTransform {
  transform(val: number) {
    return fibonacci(val);
  }
}
