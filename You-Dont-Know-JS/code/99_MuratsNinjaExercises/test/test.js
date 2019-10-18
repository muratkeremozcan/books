var findNumber = require('../phoneNumbers-text-synchronous');
var findNumberAsync = require('../phoneNumber-text-AsyncAwait');

var assert = require('assert');
var chai = require("chai");
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

describe(' SYNC version: ', function () {
  describe('positive tests', function () {
    var result = findNumber('456-123-4587');
    var expectedResult = 2;
    it('ASSERT style tests', function () {
      assert.equal(result, expectedResult);
      assert.notEqual(-1, result);
    });
    it('SHOULD style tests', function () {
      result.should.equal(expectedResult);
      result.should.not.equal(-1);
    });
    it('EXPECT style tests', function () {
      expect(result).to.equal(expectedResult);
      expect(result).not.to.equal(-1);
    });
  });

  describe('negative tests: improper phone number formats should return', function () {
    it('too many digits', function () {
      var result = findNumber('180055512345');
      expect(result).to.equal(-1);
    });
    it('prefix code too long, 4 digits', function () {
      expect(findNumber('+91 (977) 2222 7890')).to.equal(-1);
    });
    it('invalid delimeter', function () {
      findNumber('+1 800 555x1234').should.equal(-1);
    })
    it('country code too long', function () {
      findNumber('+867 800 555 123').should.equal(-1);
    });
    it('invalid characters', function () {
      findNumber('1-800-555-1234p').should.equal(-1);
    });
    it('too many spaces', function () {
      findNumber('1 (800)  555-1234').should.equal(-1);
      assert.equal(findNumber('1 (800)  555-1234'), -1);
    });
  });

  describe('SINON tests', function () {
    it('SINON SPY', function () {
      var spy = sinon.spy();

      function spyOnFindNumber(findPhoneNumber, log) {
        log(findNumber(findPhoneNumber));
        return findNumber(findPhoneNumber);
      }
      spyOnFindNumber('456-123-4587', spy);
      spy.called.should.be.true;
      spy.calledWith(2).should.be.true;
    });
    // TODO: need to learn more about sinon stubs and mocks to implement these
  });
});
describe('ASYNC VERSION', function () {
  describe('positive tests', function () {
    var result = findNumberAsync('456-123-4587');
    var expectedResult = 2;

    it('SHOULD style tests', function () {
      result.should.eventually.equal(expectedResult);
      result.should.not.equal(-1);
    });
    it('EXPECT style tests', function () {
      expect(result).to.eventually.equal(expectedResult);
      expect(result).not.to.equal(-1);
    });
  });
  describe('negative tests: improper phone number formats should return', function () {
    it('too many digits', function () {
      var result = findNumberAsync('180055512345');
      expect(result).to.eventually.equal(-1);
    });
    it('prefix code too long, 4 digits', function () {
      expect(findNumberAsync('+91 (977) 2222 7890')).to.eventually.equal(-1);
    });
    it('invalid delimeter', function () {
      findNumberAsync('+1 800 555x1234').should.eventually.equal(-1);
    })
    it('country code too long', function () {
      findNumberAsync('+867 800 555 123').should.eventually.equal(-1);
    });
    it('invalid characters', function () {
      findNumberAsync('1-800-555-1234p').should.eventually.equal(-1);
    });
    it('too many spaces', function () {
      findNumberAsync('1 (800)  555-1234').should.eventually.equal(-1);
      expect(findNumberAsync('1 (800)  555-1234')).to.eventually.equal(-1);
    });
  });
});

/*
Invalid:
180055512345       // Too many digits
1 800 5555 1234    // Prefix code too long
+1 800 555x1234    // Invalid delimiter
+867 800 555 1234  // Country code too long
1-800-555-1234p    // Invalid character
1 (800)  555-1234  // Too many spaces
*/