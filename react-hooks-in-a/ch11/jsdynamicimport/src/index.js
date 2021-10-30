function handleClick() {
  import("./helloModule").then((module) => {
    module.default("messagePara", "Hello World!");
    module.sayHi("hiPara");
  });
}

document.getElementById("btnMessages").addEventListener("click", handleClick);
