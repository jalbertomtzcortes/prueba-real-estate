const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function createUser() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)",
    ["Admin", "admin@realestate.com", hashedPassword, "admin"]
  );

  console.log("Usuario creado");
  process.exit();
}

createUser();