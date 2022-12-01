const express = require("express");
const bodyParser = require("body-parser");
const { insertRow, getAllRows, getSingleRow } = require("./dbConnection");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is now listening at port ${PORT}`);
});

// List all Users -> User[]
app.get("/users", (_req, res) => {
  getAllRows(res, "users");
  console.log("get users");
});

// Get single User by ID -> [User]
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  getSingleRow(res, "users", id);
});

// Insert User
app.post("/users", (req, res) => {
  const body = req.body;
  insertRow(res, body, "users");
});
