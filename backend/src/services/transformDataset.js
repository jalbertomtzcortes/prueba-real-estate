const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const normalizeEncoding = require("../utils/normalizeEncoding");


const inputFile = path.join(__dirname, "../../../database/4S_DataSet_Confidential.csv");
const outputFiles = [
  path.join(__dirname, "../../../database/dataset_clean.csv"),
  path.join(__dirname, "../../src/dataset/dataset_clean.csv")
];

let raw = fs.readFileSync(inputFile, "utf8");
raw = normalizeEncoding(raw).replace(/\r/g, "");

const lines = raw.split("\n").filter(l => l.trim() !== "");
const headers = lines[0].split(",");

const results = [];

for (let i = 1; i < lines.length; i++) {
  const columns = lines[i].split(",");
  if (columns.length < 4) continue;

  const city = normalizeEncoding(columns[0] || "");
  const zone = normalizeEncoding(columns[1] || "");
  const project = normalizeEncoding(columns[2] || "");

  if (!city || !zone || !project) continue;

  for (let j = 3; j < headers.length; j++) {
    let value = columns[j];
    if (!value) continue;

    value = value.replace(/,/g, "").trim();
    const numericValue = Number(value);

    if (!isNaN(numericValue) && numericValue > 0) {
      results.push({
        city,
        zone,
        project_name: project,
        period: headers[j].trim(),
        price_per_m2: numericValue,
      });
    }
  }
}

(async () => {
  for (const outputFile of outputFiles) {
    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "city", title: "city" },
        { id: "zone", title: "zone" },
        { id: "project_name", title: "project_name" },
        { id: "period", title: "period" },
        { id: "price_per_m2", title: "price_per_m2" },
      ],
    });

    await csvWriter.writeRecords(results);
  }

  console.log("Dataset transformado correctamente ✅");
  console.log("Total registros generados:", results.length);
})();
