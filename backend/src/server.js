const app = require("./app");
const loadData = require("./graphql/loadGraph");
const pool = require("./config/database");


const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;
const shouldLoadGraph = (process.env.LOAD_GRAPH_ON_STARTUP || (process.env.NODE_ENV === "production" ? "false" : "true"))
  .toLowerCase() === "true";

async function startServer() {
  await pool.verifyPostgresConnection();

  if (shouldLoadGraph) {
    try {
      await loadData();
    } catch (error) {
      console.error("⚠️ Neo4j no disponible al iniciar, se omite seed:", error.message);
    }
  } else {
    console.log("ℹ️ Seed Neo4j deshabilitado en arranque (LOAD_GRAPH_ON_STARTUP=false)");
  }

  app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  });
  
}

startServer().catch((error) => {
  console.error("❌ Error fatal en arranque:", error);
  process.exit(1);
});
