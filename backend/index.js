// const express = require("express");
// const bodyParser = require("body-parser");
// const sequelize = require("./db");
// const userRoutes = require("./routes/userRoutes");
// const errorHandler = require("./middleware/errorHandler");

// const app = express();
// app.use(bodyParser.json());

// // Routes
// app.use("/users", userRoutes);

// // Error Middleware
// app.use(errorHandler);

// // Sync DB
// sequelize.sync();

// // Start server
// app.listen(3000, () => console.log("Server running on port 3000"));
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const sequelize = require("./db");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

//  Enable CORS for React frontend (localhost:3001)
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);

// Error Middleware
app.use(errorHandler);

// Sync DB
sequelize.sync();

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
