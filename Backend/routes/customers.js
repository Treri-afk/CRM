const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Récupérer tous les customers
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      c.*,
      cs.name AS status
    FROM customers c
    LEFT JOIN customer_status cs ON c.status_id = cs.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Récupérer un customer par ID
router.get("/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  const sql = `
    SELECT 
      c.*,
      cs.name AS status
    FROM customers c
    LEFT JOIN customer_status cs ON c.status_id = cs.id
    WHERE c.id = ?
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(results[0]);
  });
});

// Mettre à jour un customer (PUT)
router.put("/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const {
    customer_name,
    contact_name,
    contact_email,
    contact_phone,
    legalForm,
    siret,
    rcsNumber,
    industry,
    status,
    website,
    lastContactDate
  } = req.body;

  if (!customer_name || !contact_name || !contact_email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    UPDATE customers SET
      customer_name = ?,
      contact_name = ?,
      contact_email = ?,
      contact_phone = ?,
      legalForm = ?,
      siret = ?,
      rcsNumber = ?,
      industry = ?,
      status = ?,
      website = ?,
      lastContactDate = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [
    customer_name,
    contact_name,
    contact_email,
    contact_phone,
    legalForm,
    siret,
    rcsNumber,
    industry,
    status,
    website,
    lastContactDate,
    customerId
  ], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer updated", id: customerId });
  });
});

// Mettre à jour partiellement un customer (PATCH)
router.patch("/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const allowedFields = [
    "customer_name",
    "contact_name",
    "contact_email",
    "contact_phone",
    "legalForm",
    "siret",
    "rcsNumber",
    "industry",
    "status",
    "website",
    "lastContactDate"
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

  values.push(customerId);
  const sql = `UPDATE customers SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer updated" });
  });
});

// Supprimer un customer
router.delete("/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql = "DELETE FROM customers WHERE id = ?";

  db.query(sql, [customerId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted" });
  });
});

module.exports = router;