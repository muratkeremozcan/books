// !! interpolated string literals !!
var name = 'Kyle';

var greeting = 'Hello ' + name + '!';

console.log(greeting);
typeof greeting; //?

// ` ` can split across multiple lines
// observe Output tab if using Quokka
var text =
 `Now is the time for all good men
 to come to the aid of their 
 country!`; //?


// Any valid expression is allowed to appear inside ${..} in an interpolated string literal, 
// including function calls, inline function expression calls, and even other interpolated string literals!
function upper(s) {
  return s.toUpperCase();
}

var who = 'reader';

// can call a function
var textovic = 
` A very ${upper('warm')} welcome 
  to all of you ${upper(`${who}s`)}!`; //?