const express = require('express'); // Express (framework) focuses on modeling your application in terms of HTTP requests and responses. It's built using Node's http module.
const app = express(); // For a basic web application, create an application instance, bind the application to a TCP port and add a route handler

const port = process.env.PORT || 3000; // bind the application to a TCP port
// app.set('port', process.env.PORT || 3000); // alternative

// remember Event emitters in 2.11
// EE.addListener(eventName, eventListener)
// EE.on(eventName, eventListener)
// EE.once(eventName, eventListener)
// EE.removeListener(eventName, eventListener)

// routes are similar
// app.get/set/post/delete/use(routeName, routeHandler)

// app.get(routeName, routeHandler)
app.get('/', (req, res) => { // adding a route handler
  res.send('Hello World');
});
// app.listen(portName, optionalCallback)
app.listen(port, () => { // bind application to the tcp port. The listen also takes an optional callback function, which is called once the app is ready to start taking requests
  console.log(`Express web app available at localhost: ${port}`);
});
// to execute, run the file in node:  node index.js 
// or, utilize npm script at package.json file (under script>start) : npm start
// then browse to http://localhost:3000/ or http://127.0.0.1:3000
// you can run on a different port by adding PORT=3001 in the beginning :   PORT=3001 npm start/node index.js