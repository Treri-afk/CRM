const express = require("express");
const router = express.Router();
const db = require("../config/db");

//créer un nouveaux company
router.get("/customers", (req, res) => {

  const sql = `SELECT * FROM customer_status`;

  db.query(
    sql,
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results);
    }
  );

});

module.exports = router;