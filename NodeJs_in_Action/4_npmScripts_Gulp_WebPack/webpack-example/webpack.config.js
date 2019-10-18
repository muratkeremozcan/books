const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.jsx', // define an entry: main file that loads the application
  output: { path: __dirname, filename: 'dist/bundle.js' },  // output file: create if it doesn't exist
  resolve: { // the source example is missing this, have to add it  to avoid errors
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader', // define loader
        test: /.jsx?$/, // associate the loader with file glob search using test property
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'] // using the babel es2015 and React plugins. PLUGINS are used to change the behavior of the build process. Plugins are instances of classes that can hook into webpack's more low-level APIs
        }
      }
    ]
  },
};

// TO RUN :   ./node_modules/.bin/webpack   will compile an ES5 version of the file with the React dependencies

/**
 * Although Gulp can be used for building client-side assets, there are also tools specifically designed to do
that, which means they typically require less code and configuration than Gulp. One
such tool is webpack, which focuses on bundling JavaScript and CSS modules.
 * One of the advantages of webpack is that it’s easier to quickly set up a build system
that supports incremental builds. If you set it up to automatically build when files
change, it won’t need to rebuild the entire project when a single file changes. As a
result, builds can be faster and easier to understand.

* LOADER :  loaders are transformations that are applied to resource files. If you need to convert SASS to CSS , or ES2015 to ES5 , you need a loader. Loaders
are functions that transform input source text into output
* If you need to convert React code, CoffeeScript, SASS , or any other transpiled languages, you’re looking for a loader.

* PLUGIN: plugins are used to change the behavior of the build process. Plugins are instances of classes that can hook into more low-level API s.
* If you need to instrument your JavaScript, or manipulate sets of files in some way, you’ll need a plugin.
 */