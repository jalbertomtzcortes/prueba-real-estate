const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/database");

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  console.log("📥 Login request recibido");
  console.log("Email recibido:", email);
  console.log("Password recibido:", password);

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    console.log("🔎 Resultado query:", result.rows);

    if (result.rows.length === 0) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.rows[0];

    console.log("👤 Usuario encontrado:", user.email);
    console.log("🔐 Hash en DB:", user.password);

    const validPassword = await bcrypt.compare(password, user.password);

    console.log("🔍 Resultado bcrypt.compare:", validPassword);

    if (!validPassword) {
      console.log("❌ Password incorrecto");
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    console.log("✅ Password correcto");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log("🎟 Token generado");

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {

    console.error("🔥 Error en login:", err);

    res.status(500).json({
      error: "Error en login"
    });

  }

});

module.exports = router;