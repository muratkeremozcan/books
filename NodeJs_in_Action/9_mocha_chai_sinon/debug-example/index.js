// If you want to incorporate the NODE_DEBUG functionality into your own projects, use the built-in util.debuglog method
const debuglog = require('util').debuglog('example');
debuglog('You can only see these messages by setting NODE_DEBUG=example!');

const debugViews = require('debug')('debug-example:views');
const debugModels = require('debug')('debug-example:models');

debugModels('Example model message');
debugViews('Example view message');

// To run this example and see the view logs, set DEBUG
// DEBUG='*' node index.js
// DEBUG=debug-example:views node index.js
// DEBUG=debug-example:models node index.js

// you can prefix a debug section with a hyphen to remove it from logs:
// DEBUG='* -debug-example:views' node index.js