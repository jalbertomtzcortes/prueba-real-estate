require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");



const cityRoutes = require("./routes/cityRoutes");
const projectRoutes = require("./routes/projectRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const priceRoutes = require("./routes/priceRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use("/api/cities", cityRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/chat", chatRoutes);

// 
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;