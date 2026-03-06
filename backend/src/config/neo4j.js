const neo4j = require("neo4j-driver");

const useLocalDefaults = process.env.NODE_ENV !== "production";
const uri = process.env.NEO4J_URI || (useLocalDefaults ? "bolt://neo4j:7687" : "");
const user = process.env.NEO4J_USER || (useLocalDefaults ? "neo4j" : "");
const password = process.env.NEO4J_PASSWORD || (useLocalDefaults ? "admin123" : "");

let driver = null;

if (uri && user && password) {
  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
} else {
  console.warn("⚠️ Neo4j deshabilitado: faltan NEO4J_URI/NEO4J_USER/NEO4J_PASSWORD");
}

module.exports = driver;
