var capitalize = require('../capitalize'); // require the file to test
var chai = require('chai'); // require chai to make assertions
var expect = chai.expect; // use expect property of chai to run assertions in your tests

describe('capitalize function', () => { // at Mocha level you break tests into pieces
  it('capitalizes single words', () => {
    expect(capitalize('express')).to.equal('Express');
    expect(capitalize('cats')).to.equal('Cats');
  });
  it('makes the rest of the string lowercase', () => {
    expect(capitalize('javaScript')).to.equal('Javascript');
  });
  it('leaves strings with no words alone', () => {
    expect(capitalize(' ')).to.equal(' ');
    expect(capitalize('123#$*')).to.equal('123#$*');
  });
  it('leaves empty strings alone', () => {
    expect(capitalize('')).to.equal('');
  });
  it('capitalizes multiple word strings', () => {
    expect(capitalize('what is Express?')).to.equal('What is express?');
    expect(capitalize('i love lAmp')).to.equal('I love lamp');
  });
  it('leaves already capitalized words alone', () => {
    expect(capitalize('Evan')).to.equal('Evan');
    expect(capitalize('Express')).to.equal('Express');
    expect(capitalize('Catman')).to.equal('Catman');
  });
  it('capitalizes string objects without changing their values', function() {
    var str =  new String('who is JavaScript?');
    expect(capitalize(str)).to.equal('Who is javascript?');
    expect(str.valueOf()).to.equal('who is JavaScript?'); // str.valueOf converts String object to a normal string
  });

});