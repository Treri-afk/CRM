const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all deals
router.get("/", (req, res) => {
  db.query("SELECT * FROM deals", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET deal by ID
router.get("/:dealId", (req, res) => {
  const { dealId } = req.params;
  db.query("SELECT * FROM deals WHERE id = ?", [dealId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Deal not found" });
    res.json(results[0]);
  });
});

// POST new deal
router.post("/", (req, res) => {
  const { id_company, id_customer, title, status, estimation, probability, clotureDate, responsable, description } = req.body;
  if (!id_company || !id_customer || !title || !status || !clotureDate) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `INSERT INTO deals 
    (id_company, id_customer, title, status, estimation, probability, clotureDate, responsable, description, date_creation, date_update)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(sql, [id_company, id_customer, title, status, estimation, probability, clotureDate, responsable, description], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Deal created", id: result.insertId });
  });
});

// PUT (update all fields)
router.put("/:dealId", (req, res) => {
  const { dealId } = req.params;
  const { id_company, id_customer, title, status, estimation, probability, clotureDate, responsable, description } = req.body;

  const sql = `UPDATE deals 
    SET id_company=?, id_customer=?, title=?, status=?, estimation=?, probability=?, clotureDate=?, responsable=?, description=?, date_update=NOW() 
    WHERE id=?`;

  db.query(sql, [id_company, id_customer, title, status, estimation, probability, clotureDate, responsable, description, dealId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deal updated" });
  });
});

// PATCH (update partial fields)
router.patch("/:dealId", (req, res) => {
  const { dealId } = req.params;
  const fields = req.body; // exemple: { title: "New Title", status: 3 }
  const updates = Object.keys(fields).map(key => `${key}=?`).join(", ");
  const values = [...Object.values(fields), dealId];

  const sql = `UPDATE deals SET ${updates}, date_update=NOW() WHERE id=?`;
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deal partially updated" });
  });
});

// DELETE deal
router.delete("/:dealId", (req, res) => {
  const { dealId } = req.params;
  db.query("DELETE FROM deals WHERE id=?", [dealId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deal deleted" });
  });
});

module.exports = router;