const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let request_counter = 0;

server.use((req, res, next) => {
  request_counter++;
  if (request_counter > 1) {
    console.log(`Já foram feitas ${request_counter} requisições!`);
  } else {
    console.log(`Foi feita ${request_counter} requisição!`);
  }
  return next();
});

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => {
    return p.id === id;
  });

  if (!project) {
    return res.status(400).json({ error: "ID does not exists!" });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => {
    return p.id === id;
  });

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => {
    return p.id === id;
  });

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => {
    return p.id === id;
  });

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
