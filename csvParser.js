const csv = require("csv-parser");
const fs = require("fs");

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
      .on("error", reject);
  });

module.exports = { CSVToJSON };
