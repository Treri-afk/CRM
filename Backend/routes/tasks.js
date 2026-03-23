const express = require("express");
const router = express.Router();
const db = require("../config/db");


// GET all tasks
router.get("/", (req, res) => {

  db.query(`
    SELECT 
      tasks.*,
      tasks_type.name AS type_name,
      tasks_status.name AS status_name,
      tasks_priority.name AS priority_name,
      customers.customer_name AS customer_name,
      deals.title AS deal_name
    FROM tasks
    JOIN tasks_type ON tasks.type_id = tasks_type.id
    JOIN tasks_status ON tasks.status_id = tasks_status.id
    JOIN tasks_priority ON tasks.priority_id = tasks_priority.id
    LEFT JOIN customers ON tasks.customer_id = customers.id
    LEFT JOIN deals ON tasks.deal_id = deals.id
  `, (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);

  });

});


// GET task by id
router.get("/:id", (req, res) => {

  const id = req.params.id;

  db.query(`
    SELECT 
      tasks.*,
      tasks_type.name AS type_name,
      tasks_status.name AS status_name,
      tasks_priority.name AS priority_name,
      customers.customer_name AS customer_name,
      deals.title AS deal_name
    FROM tasks
    JOIN tasks_type ON tasks.type_id = tasks_type.id
    JOIN tasks_status ON tasks.status_id = tasks_status.id
    JOIN tasks_priority ON tasks.priority_id = tasks_priority.id
    LEFT JOIN customers ON tasks.customer_id = customers.id
    LEFT JOIN deals ON tasks.deal_id = deals.id
    WHERE tasks.id = ?
  `, [id], (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(results[0]);

  });

});


// CREATE task
router.post("/", (req, res) => {

  const {
    name,
    type_id,
    status_id,
    priority_id,
    due_date,
    customer_id,
    deal_id,
    note
  } = req.body;

  if (!name || !type_id || !status_id || !priority_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO tasks
    (name, type_id, status_id, priority_id, due_date, customer_id, deal_id, note, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    sql,
    [
      name,
      type_id,
      status_id,
      priority_id,
      due_date,
      customer_id || null,
      deal_id || null,
      note
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Task created",
        id: result.insertId
      });

    }
  );

});


// UPDATE FULL task
router.put("/:id", (req, res) => {

  const id = req.params.id;

  const {
    name,
    type_id,
    status_id,
    priority_id,
    due_date,
    customer_id,
    deal_id,
    note
  } = req.body;

  if (!name || !type_id || !status_id || !priority_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `UPDATE tasks SET
    name = ?,
    type_id = ?,
    status_id = ?,
    priority_id = ?,
    due_date = ?,
    customer_id = ?,
    deal_id = ?,
    note = ?,
    updated_at = NOW()
    WHERE id = ?`;

  db.query(
    sql,
    [
      name,
      type_id,
      status_id,
      priority_id,
      due_date,
      customer_id || null,
      deal_id || null,
      note,
      id
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({
        message: "Task updated",
        id
      });

    }
  );

});


// UPDATE PARTIAL task
router.patch("/:id", (req, res) => {

  const id = req.params.id;

  const allowedFields = [
    "name",
    "type_id",
    "status_id",
    "priority_id",
    "due_date",
    "customer_id",
    "deal_id",
    "note"
  ];

  const fields = [];
  const values = [];

  for (let key of allowedFields) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(id);

  const sql = `UPDATE tasks SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;

  db.query(sql, values, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated" });

  });

});


// DELETE task
router.delete("/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task deleted" });

    }
  );

});

module.exports = router;