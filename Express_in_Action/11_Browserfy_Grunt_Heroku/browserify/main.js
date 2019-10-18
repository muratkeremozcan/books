var randomColor = require('random-color');
document.body.style.background = randomColor();
// BROWSERIFY allows to run any js file in the browser, just install the npm package, create the outFile and an html that has the outFile as a script
// browserify main.js -o compiled.js
// browserify fileToConvert -o scriptToIncludeInHtml

// https://github.com/browserify/browserify#usage