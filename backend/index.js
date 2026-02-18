import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Allow frontend (Vite on 8080) to call this API
app.use(
  cors({
    origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Dino Camp Roster API" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

// List users from database (for roster)
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, username, created_at FROM users ORDER BY id"
    );
    res.json(
      rows.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username ?? u.email.replace(/@.*/, ""),
        created_at: u.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update a user's username
app.patch("/api/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username } = req.body;
  if (Number.isNaN(id) || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "Invalid id or username" });
  }
  try {
    const { rowCount, rows } = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, name, email, username",
      [username.trim(), id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update username" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
