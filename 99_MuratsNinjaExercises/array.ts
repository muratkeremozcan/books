// get the text after the $ sign using array
;['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20'].map(item => item.split('$')[1]) //?

// find the smallest element in an array
;[99, 101, 20].sort().reverse() //?
;[99, 101, 20].reduce((minEl, el) => {
  minEl //?
  el //?
  return minEl < el ? minEl : el
}) //?
