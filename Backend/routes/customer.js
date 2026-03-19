const express = require("express");
const router = express.Router();
const db = require("../config/db");

//créer un nouveaux customer
router.post("/", (req, res) => {

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

  // validation
  if (!customer_name || !contact_name || !contact_email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO customers 
    (customer_name, contact_name, contact_email, contact_phone, legalForm, siret, rcsNumber, industry, status, website, lastContactDate, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    sql,
    [
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
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Customer created",
        id: result.insertId
      });
    }
  );

});

module.exports = router;