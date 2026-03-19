const express = require("express");
const router = express.Router();
const db = require("../config/db");

//créer un nouveaux company
router.post("/", (req, res) => {

  const {
    name,
    email,
    phone,
    legalForm,
    status,
    siret,
    address,
    website
  } = req.body;

  // validation
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO companies 
    (name, email, phone, legalForm, status, siret, address, website, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    sql,
    [
        name,
        email,
        phone,
        legalForm,
        status,
        siret,
        address,
        website
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Company created",
        id: result.insertId
      });
    }
  );

});

module.exports = router;