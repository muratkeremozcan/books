function delay_withCount(milliseconds: number, count: number): Promise<number> {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(count);
    }, milliseconds);
  });
}

// async function always returns a Promise
async function dramaticWelcome(): Promise<void> {
  console.log("Hello");

  for (let i = 0; i < 5; i++) {
    // await is converting Promise<number> into number
    const count: number = await delay_withCount(500, i);
    console.log(count);
  }

  console.log("World!");
}

dramaticWelcome(); //?


// async setTimeout
const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve(ms), ms));  : original at https://basarat.gitbook.io/typescript/future-javascript/promise

async function delayTest(ms): Promise<any> {
  try {
    let text = await delay(ms);
    return `waited ${text} ms`;
  }
  catch (e) {
    return e;
  }
}

delayTest(5000); //? 