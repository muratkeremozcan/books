const greetings = ["Hello", "Bonjour", "Hola", "Ciao", "こんにちは"];

let greetingIndex = 0;

const getNextIndex = () => {
  greetingIndex = (greetingIndex + 1) % greetings.length;
  return greetingIndex;
};

export function fetchMessageAtIndex(i, delay = 2000, canError) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (canError && Math.random() > 0.5) {
        reject("Oops!");
      } else {
        resolve({ message: greetings[i] });
      }
    }, delay);
  });
}

export function fetchFirstMessage(delay, canError) {
  return fetchMessageAtIndex(0, delay, canError);
}

export function fetchNextMessage(delay, canError) {
  return fetchMessageAtIndex(getNextIndex(), delay, canError);
}

export function fetchMessage(delay, canError) {
  return fetchMessageAtIndex(greetingIndex, delay, canError);
}
