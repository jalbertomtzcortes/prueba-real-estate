require("dotenv").config();

const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const cityRoutes = require("./routes/cityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// UTF8
app.use((req, res, next) => {
  res.setHeader("Charset", "utf-8");
  next();
});

// ===============================
// SWAGGER
// ===============================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// AUTH
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// ROUTES
// ===============================

app.use("/api/cities", cityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/chat", chatRoutes);

// ===============================
// HEALTH
// ===============================

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;