// A binary tree is a node (just an object!) that has at most two references to other nodes (themselves binary trees), 
// typically referred to as left and right child trees. Each node in the tree holds one value of the overall data structure.

// factory function to make a binary tree
var BinaryTree = (value, parent, left, right) => ({ value, parent, left, right });


// define a Binary Search Tree (BST) of common produce
var banana = BinaryTree('banana');
var apple = banana.left = BinaryTree('apple', banana);
var cherry = banana.right = BinaryTree('cherry', banana);
var apricot = apple.right = BinaryTree('apricot', apple);
var avocado = apricot.right = BinaryTree('avocado', apricot);
var cantaloupe = cherry.left = BinaryTree('cantaloupe', cherry);
var cucumber = cherry.right = BinaryTree('cucumber', cherry);
var grape = cucumber.right = BinaryTree('grape', cucumber);

// There are multiple ways to traverse a binary tree to process its values. 
// If it’s a BST (ours is!) and we do an in-order traversal – always visit the left child tree first, then the node itself, then the right child tree
// we will visit the values in ascending/sorted

// Binary trees are great for recursive processing.
// This printing method for binary tree recursively calls itself to process both left and right child trees
BinaryTree.printEach = function forEach(visitFn, node) {
  if (node) {
    if (node.left) {
      forEach(visitFn, node.left);
    }
    visitFn(node);
    if (node.right) {
      forEach(visitFn, node.right);
    }
  }
};

BinaryTree.printEach(node => console.log(node.value), banana);
// BinaryTree.forEach( node => console.log(node.value), cherry );


//////
// using FP patterns to operate on binary tree

// map
// mapperFn is passed the whole node being visited, and it expects to receive a new BinaryTree(..) node back with the transformation applied
BinaryTree.map = function map(mapperFn, node) {
  if (node) {
    let newNode = mapperFn(node);
    newNode.parent = node.parent;
    newNode.left = node.left ? map(mapperFn, node.left) : undefined;
    newNode.right = node.right ? map(mapperFn, node.right) : undefined;

    if (newNode.left) {
      newNode.left.parent = newNode;
    }
    if (newNode.right) {
      newNode.right.parent = newNode;
    }
    return newNode;
  }
};

// map the tree to a list of produce with all uppercase names:
var BANANA = BinaryTree.map(node => BinaryTree(node.value.toUpperCase()), banana);
BinaryTree.printEach(node => console.log(node.value), BANANA);


// reduce
BinaryTree.reduce = function reduce(reducerFn, initialValue, node) {
  if (arguments.length < 3) {
    // shift the parameters since 'initialValue' was omitted
    node = initialValue;
  }
  if (node) {
    let result;
    if (arguments.length < 3) {
      if (node.left) {
        result = reduce(reducerFn, node.left);
      }
      else {
        return node.right ? reduce(reducerFn, node, node.right) : node;
      }
    }
    else {
      result = node.left ? reduce(reducerFn, initialValue, node.left) : initialValue;
    }
    result = reducerFn(result, node);
    result = node.right ? reduce(reducerFn, result, node.right) : result;
    return result;

  }
  return initialValue;
}

BinaryTree.reduce((result, node) => [...result, node.value], [], banana); //?


// filter look at the book at 77%. It's insane.