{
  const { _ } = require("lodash");

  const range = 2; // increase to see the difference in scale
  const data = [_.range(0, range)];
  const arrayDepth = (arr) =>
    arr.reduce(
      (count, v) => (!Array.isArray(v) ? count : 1 + arrayDepth(v)),
      1
    );

  {
    // O(1) : constant; as far as space is concerned nothing changes, because we are not creating any new data
    const measureSpace = (data: number[]) => {
      for (let number of data) {
        console.log(number);
      }
    };

    measureSpace(data); /*?.*/
  }

  {
    // O(n) : we are creating a new array/space, as data scales the space scales linearly
    const out = [];
    const measureSpace = (data: number[]) => {
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i];
        console.log(out[i]);
      }
    };

    measureSpace(data); /*?.*/
    out;
    arrayDepth(out); //?
  }

  {
    // O(n * n) : as data scales the space scales quadratically (https://www.youtube.com/watch?v=itn09C2ZB9Y)
    const out = [];
    const measureSpace = (data) => {
      for (let i = 0; i < data.length; i++) {
        out[i] = [];
        for (let j = 0; j <= data[i].length; j++) {
          out[i][j] = data[i];
          console.log(out);
        }
      }
    };

    measureSpace(data); /*?.*/
  }
}
