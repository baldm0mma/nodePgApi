const csv = require("csv-parser");
const fs = require("fs");
const { insertRow } = require("./api");

const CSVToJSON = async (path) =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(results);
      })
      .on("error", reject("didn't work; you're bad..."));
  });

const insertCSVData = async (path) => {
  try {
    const data = await CSVToJSON(path);
    if (!!data?.length) {
      data.forEach((entry) => {
        insertRow(entry, "users");
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// npx run-func csvParser.js insertCSVData "./test.csv"

module.exports = { insertCSVData };
