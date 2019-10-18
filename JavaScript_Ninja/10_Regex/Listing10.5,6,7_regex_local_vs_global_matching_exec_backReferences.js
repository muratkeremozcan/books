const html = "<div class='test'><b>Hello</b> <i>world!</i></div>";

// matching using local regex
// when we do a local match, the first occurrence is matched and the captures within that are returned
const results = html.match(/<(\/?)(\w+)([^>]*?)>/); // matches < and optional /, a letter or word, any number of characters other than >, until >
console.log(results);
console.log(results[0]);
console.log(results[1]);
console.log(results[2]);
console.log(results[3]);

// matching using global regex
// when we do a global match, anything that matches is returned
const all = html.match(/<(\/?)(\w+)([^>]*?)>/g);
console.log(all);
console.log(all[0]);
console.log(all[1]);
console.log(all[2]);
console.log(all[3]);
console.log(all[4]);
console.log(all[5]);

// 10.6 using the EXEC method to do capturing and global search
// if you want to match using global regex and also get the captures, use exec method
const tag = /<(\/?)(\w+)([^>]*?)>/g; // matches an opening or closing tag
let match, num = 0;
while((match = tag.exec(html)) !== null) {
  console.log(match.length);
  console.log(match);
  console.log(match[0]);
  console.log(match[1]);
  console.log(match[2]);
  console.log(match[3]);
  console.log(match[4]);
  num++;
}
console.log(num);

// 10.7 using back references to match the contents of HTML tag
const htmlNew = "<b class='hello'>Hello</b> <i>world!</i>";
const pattern = /<(\w+)([^>]*)>(.*?)<\/\1>/g; // a tag opening <b, any chars, closing tag >, anything in between, until close tag /b> . Global matches the next  <i>...</i>

let matchNew = pattern.exec(htmlNew);

console.log(matchNew.length);
console.log(matchNew);
console.log(matchNew[0]);
console.log(matchNew[1]);
console.log(matchNew[2]);
console.log(matchNew[3]);
