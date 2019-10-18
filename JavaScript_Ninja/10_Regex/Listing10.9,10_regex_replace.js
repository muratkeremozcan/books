console.log("ABCDEfg".replace(/[A-Z]/g,"X"));
// "pattern".replace(regexMatch, replacementValue)
// the replacementValue can be a function

// it can be used as a replacement to the while((match = tag.exec(html)) !== null)  method
function upper(all, letter) { // all is -b and -w, letter is b and w
  return letter.toUpperCase();
}
console.log("border-bottom-width".replace(/-(\w)/g, upper)); // -b and -w gets replaced with B and W

// 10.10 a technique for compressing a query string
function compress(source) {
  const keys = {}; // to store located keys and values that we find in the source string "foo=1&foo=2&blah=a&blah=b&foo=3"
  source.replace(/([^=&]+)=([^&]*)/g, function(full, key, value) { // capture the key and the value with regex matcher: any char other than = and & 1 to infinite times, equal =, same matcher 0 to many
    console.log(full);
    console.log(key);
    console.log(value);
    console.log(keys);
    console.log(keys[key]);
    keys[key] = (keys[key] ? keys[key] + "," : "") + value; // the function gets passed the full match, the key capture and the value capture
    console.log(keys[key]);
    return ""; // we return empty string because we don't care what substitution happens to the source string, we are using side effects rather than the resultss
  });
  const result = [];
  console.log(keys);
  for(let key in keys) {
    result.push(key + "=" + keys[key]); // collect key info
  }
  return result.join(" & ");
}
console.log(compress("foo=1&foo=2&blah=a&blah=b&foo=3"));

