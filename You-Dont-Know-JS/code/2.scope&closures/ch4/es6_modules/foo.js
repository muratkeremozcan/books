import { hello } from './bar';

var hungry = 'hippo';

export default function awesome() {
  return hello(hungry).toUpperCase();
}
