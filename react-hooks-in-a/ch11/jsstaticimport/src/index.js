import showMessage, { sayHi } from "./helloModule";

function handleClick() {
  showMessage("messagePara", "Hello World!");
  sayHi("hiPara");
}

document.getElementById("btnMessages").addEventListener("click", handleClick);
