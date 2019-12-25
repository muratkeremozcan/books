// These are all called named exports, as you are in effect exporting the name bindings of the variables/ functions/ etc.

export function hello(who) {
  return 'Let me introduce: ' + who;
}

export function howAreYou() {
  return 'non-default function';
}

// you could also drop the export prefix and
// export { hello, howAreYou };
// if you export like this, you can also alias here
// export { hello as hi, howAreYou as howdy };