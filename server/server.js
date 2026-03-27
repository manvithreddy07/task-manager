const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-nine-roan.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Task Manager API running");
});

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));