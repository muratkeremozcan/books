const html = "<b>Hello</b>\n<i>world!</i>";

console.log(/.*/.exec(html)[0]); // normal capture does not handle newline
console.log(/(?:.|\s)*/.exec(html)[0]); // match everything . which is everything but newline OR | everything that is whitespace /s
console.log(/[\S\s]*/.exec(html)[0]); // any char but white space /S, any white space /s  -> this is the most preferred