const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    const user = result.rows[0];

    // Create JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user
    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { signup, login };