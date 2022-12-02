const { client } = require("./dbConfig");
const { v4: uuidv4 } = require("uuid");
const { CSVToJSON } = require("./csvParser");
const { buildQueryContentFromBody } = require("./CRUDUtilities");

// Connect to PostgreSQL DB
client.connect();

// Get table data of dynamic table
const getTableData = (res, query) => {
  client.query(query, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else throw err;
  });
  client.end;
};

// Insert single row in dynamic table
const insertRow = (res, body, tableName) => {
  const id = uuidv4();
  const itemName = tableName.slice(0, -1);
  const successMessage = `Insertion was successful of new ${itemName} of ID: ${id}`;
  const { stringifiedKeys, stringifiedValues } =
    buildQueryContentFromBody(body);
  const insertQuery = `INSERT INTO ${tableName}(id, inserted_at, ${stringifiedKeys}) VALUES ('${id}', '${Date.now()}', '${stringifiedValues}')`;

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

// Update row of single dynamic table
const updateRow = () => {};

// Update row of single dynamic table
const deleteRow = (res, id, tableName) => {
  const query = `DELETE FROM ${tableName} WHERE id=${id}`;
  client.query(query, (err, _result) => {
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

module.exports = { insertRow, getTableData, insertCSVData, deleteRow };
