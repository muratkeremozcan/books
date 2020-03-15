{ // function that mutates the input; doubles the array
  function doubleThenMutable(list) {
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i] * 2;
    }
  }
  let arr = [3, 4, 5];
  doubleThenMutable(arr);
  arr; //?
}

// how can we make it so that it does not mutate the input
{
  function doubleThenMutable(list) {
    let newList = [...list]; // to work around reference copy with arrays, [... array]
    for (let i = 0; i < newList.length; i++) {
      newList[i] = newList[i] * 2;
    }
    return newList;
  }
  let arr = [3, 4, 5];
  doubleThenMutable(arr); //?
  arr;
}

{ // Kyle's version
  function doubleThemImmutable(list) {
    var newList = [];
    for (var i = 0; i < list.length; i++) {
      newList[i] = list[i] * 2;
    }
    return newList;
  }
  var arr = [3, 4, 5];
  doubleThemImmutable(arr);
  arr;
}