var getPerson = partial(ajax, "http://some.api/person");
var getLastOrder = partial(ajax, "http://some.api/order", { id: -1 });

// we want to refactor this

getLastOrder(function orderFound(order) {
  getPerson({ id: order.personId },
    function personFound(person) {
      output(person.name);
    });
});

/** extract a property by name off of an object */
function prop(name, obj) {
  return obj[name]
}

/** sets a property by name to an object */
function setProp(name, obj, val) {
  var o = Object.assign({}, obj);
  o[name] = val;
  return o;
}

/** wraps a value at an object at a specified property name  */
function makeObjProp, value) {
  return setProp(name, {}, value);
}

// function extractName_original(person) {
//   return person.name;
// }

// make a function that’s waiting to extract the "name" property from whatever object we pass into it
var extractName = partial(prop, 'name');

var extractPersonId = partial(prop, 'personId');

var personData = partial(makeObjProp, 'id');

// output <-- extractName <-- person
var outputPersonName = compose(person, extractName);

var processPerson = partialRight(getPerson, outputPersonName);

// processPerson <-- personData <-- extractPersonId <-- order
var lookupPerson = compose(processPerson, personData, extractPersonId);

getLastOrder(lookupPerson);

