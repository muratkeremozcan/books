// copyWithin(..) copies a portion of an array to another location in the same array, overwriting whatever was there before. The arguments are 
// target (the index to copy to)
// start (the inclusive index to start the copying from) 
// end (optional - the exclusive index to stop copying)

// If any of the arguments are negative, they’re taken to be relative from the end of the array.
// does not extend the array's length: copying stops when the end of the array is reached

[1,2,3,4,5].copyWithin(3, 0); //?
[1,2,3,4,5].copyWithin(3, 0, 1); //?
[1,2,3,4,5].copyWithin(0, -2); //?
[1,2,3,4,5].copyWithin(0, -2, -1); //?


// copying does not always go left to right; to avoid repeatedly copying an already copied value if the from and target ranges overlap
// the algorithm avoids this case by copying in reverse order to avoid that gotcha.
[1,2,3,4,5].copyWithin(2, 1); //?