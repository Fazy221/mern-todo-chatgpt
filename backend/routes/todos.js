const express = require("express");
const router = express.Router();
const db = require("../config/db");
const passport = require("passport");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Protect the routes
router.use(isAuthenticated);

// Get all todos for the logged-in user
router.get("/", (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM todos WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Error fetching todos: ", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Add a new todo
router.post("/", (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  db.query(
    "INSERT INTO todos (title, user_id) VALUES (?, ?)",
    [title, userId],
    (err, result) => {
      if (err) {
        console.error("Error adding todo: ", err);
        return res.status(500).json({ error: err.message });
      }
      const newTodo = {
        id: result.insertId,
        title,
        completed: false,
        user_id: userId,
      };
      res.json(newTodo);
    }
  );
});

// Update a todo
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const userId = req.user.id;
  db.query(
    "UPDATE todos SET title = ?, completed = ? WHERE id = ? AND user_id = ?",
    [title, completed, id, userId],
    (err) => {
      if (err) {
        console.error("Error updating todo: ", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Todo updated successfully" });
    }
  );
});

// Delete a todo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, userId],
    (err) => {
      if (err) {
        console.error("Error deleting todo: ", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Todo deleted successfully" });
    }
  );
});

module.exports = router;
