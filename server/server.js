import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(cors());
app.use(express.json());

const tasks = [
  {
    id: "1",
    text: "Test task",
    completed: false,
    priority: "medium",
  },
];

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id");

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { text, priority } = req.body;

    const result = await pool.query(
      `
      INSERT INTO tasks (id, text, completed, priority)
      VALUES (gen_random_uuid(), $1, false, $2)
      RETURNING *
      `,
      [text, priority],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.patch("/api/tasks/:id/completed", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET completed = $1
      WHERE id = $2
      RETURNING *
      `,
      [completed, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      `,
      [id],
    );

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, priority } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET text = $1,
          priority = $2
      WHERE id = $3
      RETURNING *
      `,
      [text, priority, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
