const path = require('path');
const webpack = require('webpack');
 
module.exports = {
  entry: './app/index.js',
  output: { path: __dirname, filename: 'dist/bundle.js' },
};

/**if you’re using webpack with a more vanilla, C ommon JS project, then webpack can provide everything you need without a Common JS browser shim.
 * need the files under app/  .
 * you need only a small webpack config file to define the entry point (the first snippet), and the build destination path
*/