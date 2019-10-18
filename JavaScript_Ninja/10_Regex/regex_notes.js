// regex literal, use a dev time when you know the regex in advance and can store it:      /test/
const example = /translateY\(([^\)]+)\)/ // translateY matches the characters translateY literally (case sensitive), \( matches ( literally, match anything [^\)] that's not ) until it reaches )

// regex constructor, use at runtime when you do not know the regex in advance:  new RegExp("test")
new RegExp("(^|\\s)" + className + "(\\s|$)"); // match the beginning of the string ^ OR | whitespace character \s + className + whitespace character \s or | the end of the string $

// match method : takes in a regex, returns an array containing the matched string and any captures
const results = "<div class='test'><b>Hello</b> <i>world!</i></div>".match(/<(\/?)(\w+)([^>]*?)>/);

// replace method: causes a replacement on pattern matches rather than on a fixed string
console.log("ABCDEfg".replace(/[A-Z]/g,"X")); // "pattern".replace(regexMatch, replacementValue)  , the replacementValue can be a function

// exec method: if you want to match using global regex and also get the captures, use exec method
const match = /<(\/?)(\w+)([^>]*?)>/g.exec("<div class='test'><b>Hello</b> <i>world!</i></div>");


/*
FLAGS
/test/ig
new RegExp("test", "ig")

i   case insensitive
g   match all instances of a pattern
m   match across multiple lines
y   sticky matching
u   unicode use

[]     to specify a set o characters, a single character() to match  [abc]  also a range [a-z]
^      pattern must appear in the beginning of a string  [^abc]     if before a set ^[] used to negate the that set ex: ^[0-9]  mean anything but digits
$      pattern must appear in the end of a string
?      term is optional (can appear 0 or 1 time)        /t?est/   ->  est, test
*      term should appear 0 to many times              /t*est/   ->  est, test, ttest, tttest
+      term should appear 1 to many times              /t+est/   ->  test, ttest, tttest
\      escape regex characters  []$^()/\
()     to group terms together                        /(ab)+/
?:     to indicate a () should not result in a capture     /((?:ninja-)+)sword/
{}     to specify fixed number of repetitions, range or open ended          /a{4}   /a{4,10}   /a{4,}
|      to specify OR logic                            /(ab)+|(cd)+/
\1 \2..portions of a string that are successfully matched can be back-referenced with a backslash followed by the number of the capture
*/
const pattern = /<(\w+)([^>]*)>(.*?)<\/\1>/g; // we use /1 to refer to the first capture within the expression


/*
PREDEFINED CHAR CLASSES
\n    new line
\r    carriage return
\t    horizontal tab
\v    vertical tab

.     any character but white-space
\d    any digit [0-9]
\D    any char but digit ^[0-9]
\w    any alphanumeric char including underscore [A-Za-z0-9_]
\W    any character but alphanumeric and underscore ^[A-Za-z0-9_]

\s    any white-space char (space, tab, form feed)
\S    any character but white-space character
\b    a word boundary
\B    not a word boundary (inside a word)

\b    backspace
\f    form feed
\cA : \cZ   control characters
\u0000 : \uFFFF   unicode hexadecimal
\x00 : \xFF   ASCII hexadecimal


*/