// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Task Manager API Running");
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");

const cors = require("cors");

app.use(cors({
  origin: "https://task-manager-nine-roan.vercel.app",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager API running");
});

app.use("/auth", authRoutes);   // /auth/signup, /auth/login
app.use("/tasks", tasksRoutes); // protected task routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
