import R from 'ramda';

// remember zip? Used in FP to merge 2 corresponding arrays

const records = R.zip (
  ['RecordA', 'RecordB', 'RecordC'],
  ['123', '456', '789'],
);
/*
[ [ 'RecordA', '123' ], 
  [ 'RecordB', '456' ], 
  [ 'RecordC', '789' ] 
] 
*/
