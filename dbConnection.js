const { client } = require("./dbConfig");
const { v4: uuidv4 } = require("uuid");
const { CSVToJSON } = require("./csvParser");

// Connect to PostgreSQL DB
client.connect();

// Insert single row in dynamic table
const insertRow = (body, tableName, res) => {
  const id = uuidv4();
  const keys = Object.keys(body);
  const itemName = tableName.slice(0, -1);
  const successMessage = `Insertion was successful of new ${itemName} of ID: ${id}`;
  const stringifiedKeys = keys.join(", ");
  const stringifiedValues = keys.map((key) => body[key]).join("', '");
  const insertQuery = `INSERT INTO ${tableName}(id, ${stringifiedKeys}) values('${id}', '${stringifiedValues}')`;

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

// Get all rows of dynamic table
const getAllRows = (res, tableName) => {
  client.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

// Get single row of dynamic table
const getSingleRow = (res, tableName, id) => {
  client.query(`SELECT * FROM ${tableName} WHERE id=${id}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

// Insert CSV data into table
const insertCSVData = async (path, tableName) => {
  try {
    const data = await CSVToJSON(path);
    if (!!data?.length) {
      data.forEach((entry) => {
        insertRow(entry, tableName);
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// To run the above function from the command line vvv
// npx run-func dbConnection.js insertCSVData "<filePath.csv>" "<tableName>"

module.exports = { insertRow, getAllRows, getSingleRow, insertCSVData };
