const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const driver = require("../config/neo4j");

async function loadData() {

  const session = driver.session();

 const filePath = path.join(__dirname, "../dataset/dataset_clean.csv");

  return new Promise((resolve, reject) => {

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {

        try {

          await session.run(
            `
            MERGE (c:Ciudad {nombre:$ciudad})

            CREATE (p:Propiedad {
              id:$id,
              precio:$precio,
              habitaciones:$habitaciones
            })

            MERGE (p)-[:UBICADO_EN]->(c)
            `,
            {
              id: row.id,
              precio: parseFloat(row.precio),
              habitaciones: parseInt(row.habitaciones),
              ciudad: row.ciudad
            }
          );

        } catch (error) {
          console.log("Error insertando:", error);
        }

      })
      .on("end", () => {
        console.log("Datos cargados en el grafo");
        resolve();
      })
      .on("error", reject);

  });

}

module.exports = loadData;