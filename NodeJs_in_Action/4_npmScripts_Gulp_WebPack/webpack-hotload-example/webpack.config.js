const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.jsx', // define an entry: main file that loads the application
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/, // associate with file glob search using test property
        loader: 'babel-loader', // define loader
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'] // using the babel es2015 and React plugins. PLUGINS are used to change the behavior of the build process. Plugins are instances of classes that can hook into webpack's more low-level APIs
        }
      }
    ]
  },
};

// If you want to avoid having to rebuild the project whenever a React file changes, you can use the webpack development server
// The server builds assets and stores them in memory rather than in your webpack output folder.
// run the server with :  webpack-dev-server --hot --inline --content-base dist/ --port 3001 , http://localhost:3001/ and load the app

// The --hot option makes the dev server use hot module reloading.
// The refresh mechanism is specified with the --inline option
// If you edit the example React file in app/index.jsx, you should see the browser refresh.