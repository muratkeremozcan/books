class Example {
  render() {
    return '<h1>Example</h1>';
  }
}
const example = new Example();
console.log(example.render());

/**
 * Transpilers such as Babel are used to convert modern ES2015 into more widely supported ES5 code
 * ./node_modules/.bin/babel browser.js -d build/  : will take browser.js, transpile with babel into ES5 to directory build/
 * ./node_modules/.bin/uglifyjs build/browser.js -o build/browser.min.js  : will uglify (single-line) to output build/browser.min.js
 *
 *  you can configure front-end build tools in three ways
 * in cmd line : ./node_modules/.bin/uglify --source-map
 * project-specific configuration file with options: Babel
 * Adding configuration options to package.json
*/