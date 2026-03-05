const path = require("path");
const fs = require("fs");
const iconv = require("iconv-lite");
const { createObjectCsvWriter } = require("csv-writer");


const inputFile = path.join(__dirname, "../../../database/4S_DataSet_Confidential.csv");
const outputFile = path.join(__dirname, "../../../database/dataset_clean.csv");

const rawBuffer = fs.readFileSync(inputFile);


let raw = iconv.decode(rawBuffer, "latin1");


raw = raw.replace(/^\uFEFF/, "").replace(/\r/g, "");

const lines = raw.split("\n").filter(l => l.trim() !== "");
const headers = lines[0].split(",");

const results = [];

for (let i = 1; i < lines.length; i++) {
  const columns = lines[i].split(",");
  if (columns.length < 4) continue;

  const city = columns[0]?.trim();
  const zone = columns[1]?.trim();
  const project = columns[2]?.trim();

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

  console.log("Dataset transformado correctamente ✅");
  console.log("Total registros generados:", results.length);
})();