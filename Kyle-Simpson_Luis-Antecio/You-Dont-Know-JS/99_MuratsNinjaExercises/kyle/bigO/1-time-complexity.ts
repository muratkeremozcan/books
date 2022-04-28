{
  const { _ } = require("lodash");

  const range = 100; // increase to see the difference in scale
  const data = [_.range(0, range)];

  {
    // O(n) : as data scales, time scales linearly
    const measureTime = (data: number[]) => {
      for (let number of data) {
        console.log(number);
      }
    };

    measureTime(data); /*?.*/
  }

  {
    // O(n + n) : same var because both are the same value above, could be n + a if range was different
    const measureTime = (data: number[]) => {
      for (let number of data) {
        console.log(number);
      }
      for (let number of data) {
        console.log(number);
      }
    };

    measureTime(data); /*?.*/
  }

  {
    // O(n * n) : scales exponentially
    const measureTime = (data: number[]) => {
      const measureTime = (data: number[]) => {
        for (let number1 of data) {
          for (let number2 of data) {
            console.log(number1 + number2);
          }
        }
      };

      measureTime(data); /*?.*/
    };

    {
      // O(4n * n) : but the constant doesn't matter here, so it's still O(n * n)
      const measureTime = (data: number[]) => {
        for (let number1 of data) {
          for (let number2 of data) {
            console.log(number1 + number2);
            console.log(number1 + number2);
            console.log(number1 + number2);
            console.log(number1 + number2);
          }
        }
      };

      measureTime(data); /*?.*/
    }

    {
      // O(n * n + n) : but we cut off the things that scale less, so it's still O(n * n)
      const measureTime = (data: number[]) => {
        for (let number1 of data) {
          for (let number2 of data) {
            console.log(number1 + number2);
          }
        }

        for (let number of data) {
          console.log(number);
        }
      };

      measureTime(data); /*?.*/
    }
  }
}
