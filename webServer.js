const express = require("express");
const bodyParser = require("body-parser");
const { insertRow } = require("./dbCRUD");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is now listening at port ${PORT}`);
});

const TABLENAME = "users";

// List all Users -> User[]
app.get(`/${TABLENAME}`, (_req, res) => {
  getTableData(res, `SELECT * FROM ${TABLENAME}`);
});

// Get single User by ID -> [User]
app.get(`/${TABLENAME}/:id`, (req, res) => {
  const id = req.params.id;
  getTableData(res, `SELECT * FROM ${TABLENAME} WHERE id=${id}`);
});

// Insert User
app.post(`/${TABLENAME}`, (req, res) => {
  const body = req.body;
  insertRow(res, body, `${TABLENAME}`);
});
