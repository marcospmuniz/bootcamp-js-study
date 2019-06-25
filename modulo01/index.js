const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Marcos", "Victor"];

// exemplo de middleware global, que será executado em toda requisição
server.use((req, res, next) => {
  console.log(`Method: ${req.method} | Rota: ${req.url}`);

  next();
});

// exemplo de middleware local
function checkUserExists(req, res, next) {
  if (!req.body.user) {
    return res.status(400).json({ error: "Username is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  if (!users[$req.params.index]) {
    return res.status(400).json({ error: "User does not exists" });
  }

  return next();
}

// Query params = /users?name=marcos
// Route params = /users/1
// Request body = { name:  "Marcos", email: "nao-tenho@ema.il" }

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  return res.json(users[index]);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json("users");
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
