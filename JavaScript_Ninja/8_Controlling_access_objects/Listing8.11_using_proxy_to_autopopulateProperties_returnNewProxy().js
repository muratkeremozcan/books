// proxy helps control access to the object by using the traps (get and set) and helps define custom actions
// used for:
// logging
// performance measurements
// data validation
// auto-populating object properties THIS EXAMPLE
// negative array indexes
function Folder() {
  return new Proxy({}, {
    get: (target, property) => {
      console.log('Reading ' + property);
      if (!(property in target)) { // if the accessed property doesn't exist, a new folder is created and assigned to the property
        target[property] = new Folder();
      }
      return target[property];
    }
  });
}
const rootFolder = new Folder();

try {
  rootFolder.ninjasDir.firstNinjaDir.ninjaFile = "yoshi.txt"; // if the accessed property doesn't exist, create it
  console.log('an exception was not raised');
} catch (e) {
  console.log('an exception occured ' + e);
}