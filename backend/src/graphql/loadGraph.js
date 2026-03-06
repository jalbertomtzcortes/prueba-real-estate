const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const driver = require("../config/neo4j");

async function loadData() {
  const filePath = path.join(__dirname, "../dataset/dataset_clean.csv");
  const cities = new Set();
  const zonesMap = new Map();
  const projectsMap = new Map();

  const parseKey = (...parts) => parts.map((part) => part.trim()).join("::");

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        const city = (row.city || "").trim();
        const zone = (row.zone || "").trim();
        const project = (row.project_name || "").trim();

        if (!city || !zone || !project) return;

        cities.add(city);

        const zoneKey = parseKey(city, zone);
        zonesMap.set(zoneKey, { key: zoneKey, name: zone, city });

        const projectKey = parseKey(city, zone, project);
        projectsMap.set(projectKey, {
          key: projectKey,
          name: project,
          city,
          zoneKey
        });
      })
      .on("end", async () => {
        const session = driver.session();

        try {
          await session.run(`
            CREATE CONSTRAINT city_name IF NOT EXISTS
            FOR (c:City)
            REQUIRE c.name IS UNIQUE
          `);

          await session.run(`
            CREATE CONSTRAINT zone_key IF NOT EXISTS
            FOR (z:Zone)
            REQUIRE z.key IS UNIQUE
          `);

          await session.run(`
            CREATE CONSTRAINT project_key IF NOT EXISTS
            FOR (p:Project)
            REQUIRE p.key IS UNIQUE
          `);

          await session.run(
            `
            UNWIND $rows AS row
            MERGE (c:City {name: row.name})
            `,
            { rows: Array.from(cities).map((name) => ({ name })) }
          );

          await session.run(
            `
            UNWIND $rows AS row
            MATCH (c:City {name: row.city})
            MERGE (z:Zone {key: row.key})
            SET z.name = row.name
            MERGE (c)-[:HAS_ZONE]->(z)
            `,
            { rows: Array.from(zonesMap.values()) }
          );

          await session.run(
            `
            UNWIND $rows AS row
            MATCH (c:City {name: row.city})
            MATCH (z:Zone {key: row.zoneKey})
            MERGE (p:Project {key: row.key})
            SET p.name = row.name
            MERGE (z)-[:HAS_PROJECT]->(p)
            MERGE (p)-[:IN_CITY]->(c)
            `,
            { rows: Array.from(projectsMap.values()) }
          );

          console.log("Datos cargados en Neo4j (City -> Zone -> Project)");
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await session.close();
        }
      })
      .on("error", reject);
  });
}

module.exports = loadData;
