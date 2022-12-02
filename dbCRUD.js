const { v4: uuidv4 } = require("uuid");
const { CSVToJSON } = require("./csvParser");
const {
  buildInsertData,
  buildUpdateData,
  getItemNameFromTable,
} = require("./CRUDUtilities");
const { dataResponse, messageResponse } = require("./dbUtilities");

// Get table data of dynamic table
const getTableData = (successMessage = "Success!", query, res) => {
  dataResponse(successMessage, query, res);
};

// Insert single row in dynamic table
const insertRow = (body, tableName, res) => {
  const id = uuidv4();
  const itemName = getItemNameFromTable(tableName);
  const successMessage = `Insertion was successful of new ${itemName} of ID: ${id}`;
  const { stringifiedKeys, stringifiedValues } = buildInsertData(body);
  const insertQuery = `INSERT INTO ${tableName}(id, inserted_at, ${stringifiedKeys}) VALUES ('${id}', '${Date.now()}', '${stringifiedValues}')`;

  messageResponse(successMessage, insertQuery, res);
};

// Update row of single dynamic table
const updateRow = (body, tableName, res) => {
  const id = body?.id;
  if (!id) {
    throw Error("no ID send with Req Body.");
  }
  delete body.id;
  const itemName = getItemNameFromTable(tableName);
  const successMessage = `Update was successful of ${itemName} of ID: ${id}`;
  const updatedData = buildUpdateData(body);
  const updateQuery = `UPDATE ${tableName} SET ${updatedData} WHERE id=${id}`;

  messageResponse(successMessage, updateQuery, res);
};

// Delete row of single dynamic table
const deleteRow = (id, tableName, res) => {
  const itemName = getItemNameFromTable(tableName);
  const successMessage = `Deletion was successful of ${itemName} of ID: ${id}`;
  const deleteQuery = `DELETE FROM ${tableName} WHERE id='${id}'`;

  messageResponse(successMessage, deleteQuery, res);
};

// Insert CSV data into table
const insertCSVData = async (filePath, tableName) => {
  try {
    const data = await CSVToJSON(filePath);
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

module.exports = {
  deleteRow,
  getTableData,
  insertCSVData,
  insertRow,
  updateRow,
};
