const express = require("express");
const router = express.Router();
const db = require("../config/db");

//get all companies
router.get("/", (req, res) => {

  db.query("SELECT * FROM companies", (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);

  });

});

//get une company par son id
router.get("/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "SELECT * FROM companies WHERE id = ?",
    [id],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(results[0]);

    }
  );

});

//modifie entierement une company par son id
router.put("/:id", (req, res) => {

  const id = req.params.id;

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

  const sql = `UPDATE companies SET
    name = ?,
    email = ?,
    phone = ?,
    legalForm = ?,
    status = ?,
    siret = ?,
    address = ?,
    website = ?,
    updated_at = NOW()
    WHERE id = ?`;

  db.query(
    sql,
    [name, email, phone, legalForm, status, siret, address, website, id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json({
        message: "Company updated",
        id
      });

    }
  );

});

//modifie partiellement une company par son id
router.patch("/:id", (req, res) => {

  const id = req.params.id;

  const allowedFields = [
    "name",
    "email",
    "phone",
    "legalForm",
    "status",
    "siret",
    "address",
    "website"
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

  const sql = `UPDATE companies SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;

  db.query(sql, values, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company updated" });

  });

});

//delete une company par son id
router.delete("/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM companies WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json({ message: "Company deleted" });

    }
  );

});

module.exports = router;