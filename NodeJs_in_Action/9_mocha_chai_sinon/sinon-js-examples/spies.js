const sinon = require('sinon');
const fs = require('fs');
const Database = require('./db');
const database = new Database('./sample.json');

// setup the spies. SPIES ARE USED TO SEE IF A METHOD HAS BEEN CALLED
// sinon.spy(objectToSpyOn, 'methodToSpyOn')
const fsWriteFileSpy = sinon.spy(fs, 'writeFile'); // spy on fs.writeFile
const saveDone = sinon.spy(); // spy on the callback which gets called when the writeFile is done. The callback has to be function, so this is a good empty function placeholder/dummy

// do stuff
database.insert('name', 'Charles Dickens'); // setup the object to insert to the json file
database.save(saveDone); // initiate the save

sinon.assert.calledOnce(fsWriteFileSpy); // verify if fs.WriteFile has been called (this happened  in database.save(saveDone))

// fs.writeFile.restore(); // best practice to restore methods you've changed