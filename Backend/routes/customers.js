const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all customers avec leurs deals et leur status
router.get("/", (req, res) => {
  const sql = `
    SELECT customers.*, customer_status.name AS status_name,
           deals.id AS deal_id, deals.title, deals.status AS deal_status_id,
           deals.amount, deals.probability, deals.closing_date, deals.owner, deals.description, deals.created_at, deals.updated_at,
           deal_status.name AS deal_status_name
    FROM customers
    LEFT JOIN customer_status ON customers.status_id = customer_status.id
    LEFT JOIN deals ON deals.customer_id = customers.id
    LEFT JOIN deal_status ON deals.status = deal_status.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    const customersMap = {};
    results.forEach(row => {
      const customerId = row.id;

      if (!customersMap[customerId]) {
        customersMap[customerId] = {
          ...row,
          status: row.status_name, // nom du status du client
          deals: []
        };

        // Supprimer les colonnes inutiles liées aux deals
        delete customersMap[customerId].deal_id;
        delete customersMap[customerId].title;
        delete customersMap[customerId].deal_status_id;
        delete customersMap[customerId].amount;
        delete customersMap[customerId].probability;
        delete customersMap[customerId].closing_date;
        delete customersMap[customerId].owner;
        delete customersMap[customerId].description;
        delete customersMap[customerId].created_at;
        delete customersMap[customerId].updated_at;
        delete customersMap[customerId].avatar;
        delete customersMap[customerId].color;
        delete customersMap[customerId].status_name; // déjà copié dans status
        delete customersMap[customerId].deal_status_name;
      }

      if (row.deal_id) {
        customersMap[customerId].deals.push({
          id: row.deal_id,
          title: row.title,
          status: row.deal_status_name, // nom du status du deal
          amount: row.amount,
          probability: row.probability,
          closing_date: row.closing_date,
          owner: row.owner,
          description: row.description,
          avatar: row.avatar,
          color: row.color,
          created_at: row.created_at,
          updated_at: row.updated_at
        });
      }
    });

    res.json(Object.values(customersMap));
  });
});

router.get("/industry", (req, res) => {
  const sql = 'SELECT * FROM customer_industry'
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  })
})

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
    status_id, // ✅ IMPORTANT
    website,
    lastContactDate,
    avatar,
    color
  } = req.body;

  if (!customer_name || !contact_name || !contact_email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO customers 
    (customer_name, contact_name, contact_email, contact_phone, legalForm, siret, rcsNumber, industry, status_id, website, lastContactDate, avatar, color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

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
      status_id, // ✅ ici aussi
      website,
      lastContactDate,
      avatar,
      color
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Customer created",
        id: result.insertId
      });
    }
  );
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