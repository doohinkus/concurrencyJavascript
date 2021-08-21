const express = require("express");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const fibNumber = require("./util");

const port = 3000;

if (cluster.isMaster) {
  console.log(`Total number cpus ${totalCPUs}`);
  let i = 0;
  while (i < totalCPUs) {
    cluster.fork();
    i++;
  }
  cluster.on("fork", (worker) => {
    console.log(`Worker id -> ${worker.id} pid ->  ${worker.process.pid}.`);
  });
  cluster.on("exit", (worker) => {
    console.log(
      `Worker EXIT ->  ${worker.isDead()} -> id >>>> ${worker.id} pid>> ${
        worker.process.pid
      }.`
    );
    console.log("Forking worker now!!!");
    cluster.fork();
  });
} else {
  const app = express();
  app.get("/", (req, res) => {
    console.log(`Worker id >>>> ${cluster.worker.process.pid}`);
    let input = parseInt(req.query.number);
    let result = fibNumber(input);
    res.send(`<h1>${result} worker ${cluster.worker.process.pid}</h1>`);
  });

  app.listen(port, () =>
    console.log(`App running on http://localhost:${port} ...`)
  );
}
