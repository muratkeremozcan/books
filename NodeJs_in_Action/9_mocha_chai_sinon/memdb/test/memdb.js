const memdb = require('..');
const assert = require('assert');

describe('memdb', () => {
  // describes memdb functionality
  beforeEach((done) => { // async logic is optional
    // clears db beore each test to keep tests stateless
    memdb.clear();
    done(); // Async Logic: Tests can be defined as asynchronous by adding a done argument to a function
  });

  describe('synchronous .saveSync(doc)', () => {
    // describe .save() method's functionality
    it('should save the document', () => {
      // describe the expectation
      const pet = {
        name: 'Tobi'
      };
      memdb.saveSync(pet); // push pet into the array 'db'
      const ret = memdb.first({
        name: 'Tobi'
      }); // first element
      assert(ret == pet);
    });
  });

  describe('.first(obj)', () => {
    it('should return the first matching doc', () => {
      const tobi = {
        name: 'Tobi'
      };
      const loki = {
        name: 'Loki'
      };
      memdb.saveSync(tobi);
      memdb.saveSync(loki); // push to objects to the db array

      let ret = memdb.first({
        // we are stating that the first obj in the array should be Tobi
        name: 'Tobi'
      });
      assert(ret === tobi); // we are testing if it is so

      ret = memdb.first({
        // now weare saying the first obj should be Loki
        name: 'Loki'
      });
      assert(ret === loki);
    });
  });

  // IMPORTANT: Async Logic: Tests can be defined as asynchronous by adding a done argument to a function
  describe('asyncronous .save(doc)', () => {
    it('should save the document', done => {
      const pet = {
        name: 'Tobi'
      };
      memdb.save(pet, () => { // async save
        const ret = memdb.first({
          name: 'Tobi'
        });
        assert(ret === pet); // asserts that the doc has been saved
        done(); // ASYNC logic: tells mocha you are done with this test
      });
    });
  });
});
