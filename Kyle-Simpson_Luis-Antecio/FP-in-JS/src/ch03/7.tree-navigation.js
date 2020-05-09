const _ = require('lodash');
const R = require('ramda');

const Node = require('../../model/Node.js').Node;
const Tree = require('../../model/Tree.js').Tree;

const Person = require('../../model/Person.js').Person;
const Address = require('../../model/Address.js').Address;

var p1 = new Person('111-11-1111', 'Haskell', 'Curry', 1900, new Address('US'));
var p2 = new Person('222-22-2222', 'Barkley', 'Rosser', 1907, new Address('Greece'));
var p3 = new Person('333-33-3333', 'John', 'von Neumann', 1903, new Address('Hungary'));
var p4 = new Person('444-44-4444', 'Alonzo', 'Church', 1903, new Address('US'));

var persons = [p1, p2, p3, p4];

var persons2 = _(persons).map(R.identity);
var p5 = new Person('555-55-5555', 'David', 'Hilbert', 1903, new Address('Germany'));
persons2.push(p5);

var p6 = new Person('666-66-6666', 'Alan', 'Turing', 1912, new Address('England'));
persons2.push(p6);

var p7 = new Person('777-77-7777', 'Stephen', 'Kleene', 1909, new Address('US'));
persons2.push(p7);

// Instantiate all nodes + adding a few more data points
const church = new Node(p4);
const rosser = new Node(p2);
const turing = new Node(p6);
const kleene = new Node(p7);
const nelson = new Node(new Person('123-23-2345', 'Nels', 'Nelson'))
const constable = new Node(new Person('123-23-6778', 'Robert', 'Constable'));
const mendelson = new Node(new Person('123-23-3454', 'Elliot', 'Mendelson'));
const sacks = new Node(new Person('454-76-3434', 'Gerald', 'Sacks'));
const gandy = new Node(new Person('454-78-3432', 'Robert', 'Gandy'));

// Create tree structure
church.append(rosser).append(turing).append(kleene);
kleene.append(nelson).append(constable);
rosser.append(mendelson).append(sacks);
turing.append(gandy);


let newTree = Tree.map(church, p => p.fullname);
newTree; //?
    

// with generator & recursion

/** traverses a binary tree using generator */
function* TreeTraversal(node) {
  yield node.value;
  if (node.hasChildren()) {
      for(let child of node.children) {
          yield* TreeTraversal(child);
      }
  }
}

var root = new Node(new Person('Alonzo', 'Church', '111-11-1231'));

for(let person of TreeTraversal(root)) {
 console.log(person.lastname);
}
