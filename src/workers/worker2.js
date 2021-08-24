const fibNumber = require("../util");

process.on("message", (number) => {
  console.log(`Fib 2 process on PID: ${process.pid}`);
  process.send(fibNumber(number));
});
