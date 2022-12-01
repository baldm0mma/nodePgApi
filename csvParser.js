const csv = require("csv-parser");
const fs = require("fs");

// Pares CSV file
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
      .on("error", () => reject("Promise rejected in stream"));
  });

module.exports = { CSVToJSON };
