let w = 1, z = 2;

// TL, DR; default params have a scope in ( .. )
function foo( x = w + 1, y = x + 1, z = z + 1 ) {  
  // therefore you can't use a variable (the left hand side variables) from outer scope, inside the ( .. )
  // change the left hand side z to 'a' and this will work
  return { x, y, z };
}

foo(); //?

// UNDERSTAND; in JS scope bubbles out:
// The w in the w + 1 default value expression looks for w in the formal parameters’ scope, but does not find it,
  // so the outer scope’s w is used. 
// Next, the x in the x + 1 default value expression finds x in the formal parameters’ scope, and luckily x has already been initialized, 
  // so the assignment to y works fine. 
// However, the z in z + 1 finds z as a not-yet-initialized-at-that-moment parameter
