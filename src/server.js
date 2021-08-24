const express = require("express");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const fibNumber = require("./util");

const port = 3000;

if (cluster.isMaster) {
  console.log(`Total number cpus ${totalCPUs}`);
  const worker1 = require("child_process").fork("./workers/worker1");
  const worker2 = require("child_process").fork("./workers/worker2");
  console.log(`worker 1 ${worker1.pid}`);
  console.log(`worker 2 ${worker2.pid}`);
  // process the result
  worker1.on("message", (number) =>
    console.log(`Child process 1 result ->  ${number}`)
  );
  worker2.on("message", (number) =>
    console.log(`Child process 2 result -> ${number}`)
  );

  cluster.on("online", (worker) => {
    worker.on("message", (num) => {
      if (num % 2 === 0) worker1.send(num);
      else worker2.send(num);
    });
  });
  let i = 0;
  while (i < totalCPUs) {
    let worker = cluster.fork();
    console.log(`Workier taking work on pid -> ${worker.process.pid}`);
    i++;
  }
} else {
  const app = express();
  app.get("/", (req, res) => {
    process.send(req.query.number);
    console.log(`Process pid >>>> ${process.pid} received request.`);
    // let input = parseInt(req.query.number);
    // let result = fibNumber(input);
    res.send(`<h1>Request received</h1>`);
  });

  app.listen(port, () =>
    console.log(`App running on http://localhost:${port} ...`)
  );
}
