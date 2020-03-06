// find(..) yields the matched value itself from the array search, there’s also a need to find the positional index of the matched value.
// indexOf(..) does that, but there’s no control over its matching logic; it always uses === strict equality.

var points = [
  { x: 10, y: 20 }, 
  { x: 20, y: 30 }, 
  { x: 30, y: 40 }, 
  { x: 40, y: 50 }, 
  { x: 50, y: 60 }
];

points.findIndex( function matcher(point) {
  return (
    point.x % 3 == 0 &&
    point.y % 4 == 0
  )
}); //?

// Don’t use findIndex(..) != -1 (the way with indexOf(..)) to get a boolean from the search, because some(..) already yields the true/false 
// And don’t do a[ a.findIndex(..) ] to get the matched value, because that’s what find(..) accomplishes. 
// use indexOf(..) if you need the index of a strict match, or findIndex(..) if you need the index of a more customized match.
