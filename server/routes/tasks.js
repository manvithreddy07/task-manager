const express = require("express");
const auth = require("../middleware/auth");
const pool = require("../db/db");

const router = express.Router();

// ✅ GET TASKS
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, title, description, status, priority, deadline
       FROM tasks
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE TASK
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { title, description, deadline, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, deadline, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        title,
        description || "",
        deadline || null,
        priority || "medium",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ TOGGLE STATUS (FIXED)
router.put("/:id/status", auth, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET status = CASE
         WHEN status = 'pending' THEN 'completed'
         ELSE 'pending'
       END
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           deadline = $3,
           priority = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, deadline || null, priority, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;