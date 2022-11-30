const client = require("./connection.js");
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

client.connect();

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Sever is now listening at port ${PORT}`);
});

const insertRow = (req, res, tableName) => {
  const id = uuidv4();
  const body = req.body;
  const keys = Object.keys(body);
  let insertQuery = `INSERT INTO ${tableName}(id, ${keys.join(
    ", "
  )}) values('${id}', '${keys.map((key) => body[key]).join("', '")}')`;
  console.log(insertQuery, "insertquery");

  client.query(insertQuery, (err, _result) => {
    if (!err) {
      res.send(
        `Insertion was successful of new ${tableName.slice(0, -1)} of ID: ${id}`
      );
    } else throw err;
  });
  client.end;
};

const getAllRows = (res, tableName) => {
  client.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

const getSingleRow = (res, tableName, id) => {
  client.query(`SELECT * FROM ${tableName} WHERE id=${id}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

app.get("/users", (_req, res) => getAllRows(res, "users"));
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  getSingleRow(res, "users", id);
});

app.post("/users", (req, res) => insertRow(req, res, "users"));
