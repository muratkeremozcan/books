const env = process.env.NODE_ENV || 'development'; // use NODE_ENV (process.env.NODE_ENV to toggle between production and development)

function errorHandler(err, req, res, next) { // error handling middleware uses 4 arguments
  res.statusCode = 500;
  switch (env) { // depending on NODE_ENV, behaves differently
    case 'development':
      console.error('Error caught by errorHandler:');
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(err));
      break;
    default:
      res.end('Server error');
  }
}

module.exports = errorHandler;
