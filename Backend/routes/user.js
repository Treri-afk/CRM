const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {

  const {
    firstName,
    lastName,
    email,
    phone,
    company_id,
    address,
  } = req.body;

  // validation
  if (!firstName || !lastName || !email || !phone || !company_id || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `INSERT INTO users 
    (firstName, lastName, email, phone, company_id, address, date_creation, date_update)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    sql,
    [firstName, lastName, email, phone, company_id, address],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "User created",
        id: result.insertId
      });
    }
  );

});

module.exports = router;