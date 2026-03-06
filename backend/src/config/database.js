const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
    }
  : {
      host: process.env.POSTGRES_HOST || "localhost",
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "",
      database: process.env.POSTGRES_DB || "postgres",
      port: Number(process.env.POSTGRES_PORT || 5432),
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

async function verifyPostgresConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conectado a PostgreSQL");
  } catch (err) {
    console.error("⚠️ PostgreSQL no disponible al iniciar:", err.message);
  }
}

module.exports = pool;
module.exports.verifyPostgresConnection = verifyPostgresConnection;
