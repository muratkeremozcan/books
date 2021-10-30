export default function fetchMessage(delay = 2000, canError) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (canError && Math.random() > 0.5) {
        reject("Oops!");
      } else {
        resolve({ message: "Hello Data!" });
      }
    }, delay);
  });
}
