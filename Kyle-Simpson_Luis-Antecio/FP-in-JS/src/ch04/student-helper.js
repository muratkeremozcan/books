var Person = require('../../model/Person.js').Person;

var _students = {
	'11': new Person('111-11-1111', 'Alonzo', 'Church', 1911, 'USA'),
	'22': new Person('222-22-2222', 'Something', 'Curry', 1922, 'Guam'),
  '33': new Person('333-33-3333', 'HeyThere', 'Obama', 1933, 'Mexico'),
  '44': new Person('444-44-4444', 'Xabi', 'Alonzo', 1944, 'Turkey')
};

module.exports = {
	// helper functions	
};

// Helper objects
module.exports.db = {
	find: function (ssn) {
		return _students[ssn];
  	}
};