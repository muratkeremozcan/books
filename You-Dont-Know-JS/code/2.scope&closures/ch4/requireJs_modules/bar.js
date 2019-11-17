function hello(who) {
  return 'Let me introduce: ' + who;
}

function howAreYou() {
  return 'non-default function';
}

// similar to EXPORT EACH FUNCTION
module.exports = {hello, howAreYou};