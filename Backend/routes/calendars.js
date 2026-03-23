const express = require("express");
const router = express.Router();
const db = require("../config/db");


// GET all events
router.get("/", (req, res) => {

  db.query(`SELECT 
            calendar.*,
            calendar_type.name AS type_name,
            calendar_type.color,
            customers.customer_name
            FROM calendar
            JOIN calendar_type ON calendar.type_id = calendar_type.id
            JOIN customers ON calendar.customer_id = customers.id`, (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);

  });

});


// GET event by id
router.get("/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    `SELECT 
            calendar.*,
            calendar_type.name AS type_name,
            calendar_type.color,
            customers.name AS customer_name
            FROM calendar
            JOIN calendar_type ON calendar.type_id = calendar_type.id
            JOIN customers ON calendar.customer_id = customers.id WHERE id = ?`,
    [id],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(results[0]);

    }
  );

});


// CREATE event
router.post("/", (req, res) => {

  const {
    title,
    type_id,
    customer_id,
    event_date,
    event_time,
    duration,
    location,
    attendees,
    note
  } = req.body;

  // validation minimale
  if (!title || !type_id || !customer_id || !event_date || !event_time || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO calendar 
    (title, type_id, customer_id, event_date, event_time, duration, location, attendees, note, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    sql,
    [
      title,
      type_id,
      customer_id,
      event_date,
      event_time,
      duration,
      location,
      attendees,
      note
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Event created",
        id: result.insertId
      });

    }
  );

});


// UPDATE FULL event
router.put("/:id", (req, res) => {

  const id = req.params.id;

  const {
    title,
    type_id,
    customer_id,
    event_date,
    event_time,
    duration,
    location,
    attendees,
    note
  } = req.body;

  if (!title || !type_id || !customer_id || !event_date || !event_time || !duration) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `UPDATE calendar SET
    title = ?,
    type_id = ?,
    customer_id = ?,
    event_date = ?,
    event_time = ?,
    duration = ?,
    location = ?,
    attendees = ?,
    note = ?,
    updated_at = NOW()
    WHERE id = ?`;

  db.query(
    sql,
    [
      title,
      type_id,
      customer_id,
      event_date,
      event_time,
      duration,
      location,
      attendees,
      note,
      id
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({
        message: "Event updated",
        id
      });

    }
  );

});


// UPDATE PARTIAL event
router.patch("/:id", (req, res) => {

  const id = req.params.id;

  const allowedFields = [
    "title",
    "type_id",
    "customer_id",
    "event_date",
    "event_time",
    "duration",
    "location",
    "attendees",
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

  const sql = `UPDATE calendar SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;

  db.query(sql, values, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated" });

  });

});


// DELETE event
router.delete("/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM calendar WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ message: "Event deleted" });

    }
  );

});

module.exports = router;