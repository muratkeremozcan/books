//  The depth of a binary tree is the longest path down (either left or right) through the nodes of the tree. 
// Another way to define that is recursively – the depth of a tree at any node is 1 (the current node) 
// plus the greater of depths from either its left or right child trees:

/** the algo:
 * depth(node): 1 + max( depth(node.left), depth(node.right) )
 * */  
function depth (node) {
  if (node) {
    let depthLeft = depth(node.left);
    let depthRight = depth(right.left);
    return 1 + max(depthLeft, depthRight);
  }
  return 0;
}