const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
chai.should();

let foo = 'bar';
// assert style
assert.typeOf(foo, 'string');
assert.equal(foo, 'bar');
assert.lengthOf(foo, 3);
// expect style
expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.lengthOf(3);
// should style
foo.should.equal('bar');
foo.should.have.lengthOf(3);
foo.should.be.a('string');


const tea = { flavors: ['chai', 'earl grey', 'pg tips'] };
// assert style
assert.property(tea, 'flavors');
assert.lengthOf(tea.flavors, 3);
// expect style
expect(tea).to.have.property('flavors');
expect(tea.flavors).to.be.lengthOf(3);
expect(tea).to.have.property('flavors').with.lengthOf(3);
// should style
tea.should.have.property('flavors');
tea.flavors.should.have.lengthOf(3);
tea.should.have.property('flavors').with.lengthOf(3);