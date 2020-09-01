const isObject = (val) => val && typeof val === 'object';

/** recursively freezes object deeper */
function deepFreeze(obj) {
	if(isObject(obj) && !Object.isFrozen(obj)) { // skips functions and ignores objects already frozen
		Object.keys(obj).forEach(name => deepFreeze(obj[name])); // recursively freezes deeper
		Object.freeze(obj); // freezes root object
	}
	return obj;
}	

module.exports = deepFreeze;