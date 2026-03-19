const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

// GET specific user
router.get("/:userId", (req, res) => {

  const userId = req.params.userId;

  db.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results[0]);
    }
  );

});

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


//Update a user
router.put("/:userId", (req, res) => {

  const userId = req.params.userId;
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
              date_update = NOW() WHERE id = ?`;

  if(!firstName || !lastName || !email || !phone || !company_id || !address){
    return res.status(400).json({ message: "Not all fields are complete"});
  }

  db.query(sql, [firstName, lastName, email,phone,company_id,address, userId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated",
      id: userId,
      firstName, lastName, email,phone,company_id,address
    });

  });

});

router.patch("/:userId", (req, res) => {

  const userId = req.params.userId;
  const {
    firstName,
    lastName,
    email,
    phone,
    company_id,
    address,
  } = req.body;

  let fields = [];
  let values = [];

  if (firstName) {
    fields.push("firstName = ?");
    values.push(firstName);
  }
   if (lastName) {
    fields.push("lastName = ?");
    values.push(lastName);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (phone) {
    fields.push("phone = ?");
    values.push(phone);
  }
  if (company_id) {
    fields.push("company_id = ?");
    values.push(company_id);
  }
  if (address) {
    fields.push("address = ?");
    values.push(address);
  }

  values.push(userId);

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const sql = `UPDATE users SET ${fields.join(", ")},date_update = NOW() WHERE id = ?`;

  db.query(sql, values, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated",
      id: userId,
      firstName, lastName, email,phone,company_id,address
    });

  });

});

module.exports = router;