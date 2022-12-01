const client = require("./connection.js");
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// const data = CSVToJSON("./test.csv").then((data) => data);

client.connect();

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Sever is now listening at port ${PORT}`);
});

const insertRow = (body, tableName, res) => {
  const id = uuidv4();
  const keys = Object.keys(body);
  const successMessage = `Insertion was successful of new ${tableName.slice(
    0,
    -1
  )} of ID: ${id}`;
  const insertQuery = `INSERT INTO ${tableName}(id, ${keys.join(
    ", "
  )}) values('${id}', '${keys.map((key) => body[key]).join("', '")}')`;

  client.query(insertQuery, (err, _result) => {
    if (!err) {
      if (res) {
        res.send(successMessage);
      } else {
        console.log(successMessage);
      }
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

app.post("/users", (req, res) => {
  const body = req.body;
  insertRow(res, body, "users");
});

module.exports = { insertRow };
