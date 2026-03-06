const app = require("./app");
const loadData = require("./graphql/loadGraph");


const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

async function startServer() {

  await loadData();

  app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  });
  
}

startServer();
