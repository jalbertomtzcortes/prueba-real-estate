require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./config/swagger");

const cityRoutes = require("./routes/cityRoutes");
const projectRoutes = require("./routes/projectRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const priceRoutes = require("./routes/priceRoutes");
const chatRoutes = require("./routes/chatRoutes");
const presentationRoutes = require("./routes/presentation");
const aiRoutes = require("./routes/aiRoutes"); // 🔥 NUEVA RUTA


const app = express();

// =======================
// MIDDLEWARE
// =======================

app.use(cors());
app.use(express.json());

// UTF8
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// =======================
// SWAGGER
// =======================
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================
// API ROUTES
// =======================

app.use("/api/cities", cityRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/chat", chatRoutes);

// 🔥 AI ANALYSIS
app.use("/api/ai", aiRoutes);

// 🔥 PRESENTATION
app.use("/api/presentation", presentationRoutes);

// archivos html
app.use(express.static(path.join(__dirname, "public")));

// =======================
// HEALTH
// =======================

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;