const express = require('express');
const app = express();

// serve static (html) content from the static folder
app.use('/static', express.static('static'));

app.get('/', (req, res) => res.send('Hello World!'));

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`App listening on port ${port}`));
// to convert the express app to serverless export the application instance instead of running the app.listen function
// instead, you move the app.listen into an app-local.js file and import the app from here
module.exports = app;

/*
Running an HTTP server inside AWS Lambda sounds like an anti-pattern, and it has multiple downsides, such as increased execution time and function size. 
But it also has many upsides, such as preserving the existing codebase and avoiding vendor lock-in.

Note that AWS Lambda with the GoLang runtime uses a similar approach to run the function.
*/