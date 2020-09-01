function makePromise(val) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(val);
    }, Math.random() * 1000);
    setTimeout(function () {
      reject('rejected!');
    }, Math.random() * 2000);
  });
}

const prom_constructor = makePromise('I have resolved thee');

try {
  await prom_constructor; //?
}
catch (e) {
  console.log(e);
}

// or put it in an async function
async function main() {
  try {
    return await makePromise('I have resolved thee'); //?
  }
  catch (e) {
    console.log(e);
  }   
}
await main(); //?