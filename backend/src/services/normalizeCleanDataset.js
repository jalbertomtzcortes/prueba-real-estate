const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const normalizeEncoding = require("../utils/normalizeEncoding");

const targets = [
  path.join(__dirname, "../../../database/dataset_clean.csv"),
  path.join(__dirname, "../../src/dataset/dataset_clean.csv")
];

async function normalizeFile(inputPath) {
  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push({
          city: normalizeEncoding(row.city || ""),
          zone: normalizeEncoding(row.zone || ""),
          project_name: normalizeEncoding(row.project_name || ""),
          period: (row.period || "").trim(),
          price_per_m2: Number(row.price_per_m2)
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  const writer = createObjectCsvWriter({
    path: inputPath,
    header: [
      { id: "city", title: "city" },
      { id: "zone", title: "zone" },
      { id: "project_name", title: "project_name" },
      { id: "period", title: "period" },
      { id: "price_per_m2", title: "price_per_m2" }
    ]
  });

  await writer.writeRecords(rows);
  return rows.length;
}

async function run() {
  for (const file of targets) {
    const count = await normalizeFile(file);
    console.log(`Normalizado: ${path.relative(process.cwd(), file)} (${count} filas)`);
  }
}

run().catch((error) => {
  console.error("Error normalizando dataset_clean.csv:", error);
  process.exit(1);
});
