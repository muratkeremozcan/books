const sinon = require('sinon');
const fs = require('fs');
const Database = require('./db');
const database = new Database('./sample.json');

// setup the stub. STUBS ARE USED REPLACE FUNCTIONS AND CONTROL FLOW
// sinon.stub(objectToStub, 'methodToStub', yourOwnArgument)
const stub = sinon.stub(fs, 'writeFile', (file, data, cb) => { // replaces writeFile with your own function
  cb();
});
const saveDone = sinon.spy(); // spy on the callback which gets called when the writeFile is done. The callback has to be function, so this is a good empty function placeholder/dummy

// do stuff
database.insert('name', 'Charles Dickens'); // setup the object to insert to the json file
database.save(saveDone); // initiate the save

sinon.assert.calledOnce(stub); // verify if our version (stub) of fs.WriteFile has been called
sinon.assert.calledOn(saveDone);

// fs.writeFile.restore(); // best practice to restore methods you've changed