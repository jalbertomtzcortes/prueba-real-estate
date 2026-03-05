const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.POSTGRES_HOST,   // ahora apunta a postgres_db
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,   // usa la variable del .env
});


pool.query("SELECT NOW()")
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error real:", err));

module.exports = pool;