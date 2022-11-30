const client = require("./connection.js");
const express = require("express");
const bodyParser = require("body-parser");

client.connect();

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Sever is now listening at port ${PORT}`);
});

const getAllRows = (res, tableName) => {
  client.query(`Select * from ${tableName}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

app.get("/users", (_req, res) => getAllRows(res, "users"));
