// imports hello() from 'bar' module

import { hello } from './bar';

var hungry = 'hippo';

export function awesome() {
  return console.log(hello(hungry).toUpperCase());
}
