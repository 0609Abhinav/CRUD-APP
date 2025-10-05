
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors"); // Import CORS
// const sequelize = require("./db");
// const userRoutes = require("./routes/userRoutes");
// const errorHandler = require("./middleware/errorHandler");

// const app = express();

// //  Enable CORS for React frontend (localhost:3001)
// app.use(cors({
//   origin: "http://localhost:3001",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use("/users", userRoutes);

// // Error Middleware
// app.use(errorHandler);

// // Sync DB
// sequelize.sync();

// // Start server
// app.listen(3000, () => console.log("Server running on port 3000"));
// index.js (Backend)

// index.js

const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const userRoutes = require("./routes/userRoutes");
const ApiError = require("./utils/ApiError");

const app = express();

// Enable CORS for React frontend (localhost:3001)
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// User routes
app.use("/api/users", userRoutes);

// Handle 404 for unknown routes
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err); // log the error

  // Ensure statusCode is valid integer
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Sync Sequelize models with DB
sequelize
  .sync({ alter: true }) // update DB to match models
  .then(() => console.log("✅ Database synced with Sequelize"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

