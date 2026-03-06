require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/schema");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

//const cityRouters = require("./routes/cityRoutes");
const cityRouters = require("./routes/cityRouters");
const analyticsRoutes = require("./routes/analyticsRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const presentationRoutes = require("./routes/presentationRoutes");
const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

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

//app.use("/api/cities", cityRoutes);
app.use("/api/cities", cityRouters);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/presentation", presentationRoutes);
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

// ===============================
// HEALTH
// ===============================

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
