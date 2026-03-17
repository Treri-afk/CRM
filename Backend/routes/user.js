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

  const sql = `UPDATE users 
              SET firstName = ?,
              lastName = ?, 
              email = ?,
              phone = ?,
              company_id = ?,
              address = ?,
              date_creation = NOW,
              date_update = NOW() WHERE id = ?`;

  db.query(sql, [firstName, lastName, email,phone,company_id,address], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "User created",
      id: result.insertId
    });
  });
});

module.exports = router;