const express = require("express");
const bodyParser = require("body-parser");
const { insertRow, getAllRows, getSingleRow } = require("./dbConnection");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is now listening at port ${PORT}`);
});

app.get("/users", (_req, res) => {
  getAllRows(res, "users");
  console.log("get users");
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  getSingleRow(res, "users", id);
});

app.post("/users", (req, res) => {
  const body = req.body;
  insertRow(res, body, "users");
});
