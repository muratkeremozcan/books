export default function sayMessage(id, msg) {
  document.getElementById(id).innerHTML = msg;
}

export function sayHi(id) {
  sayMessage(id, "Hi");
}
