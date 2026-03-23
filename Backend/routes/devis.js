const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const devisSql = `
    SELECT 
      devis.*, 
      devis_status.name AS status_name
    FROM devis
    LEFT JOIN devis_status ON devis.status_id = devis_status.id
  `;

  const lignesSql = `
    SELECT 
      dl.*, 
      du.nom AS unite_name
    FROM devis_ligne dl
    LEFT JOIN devis_unite du ON dl.unite_id = du.id
  `;

  db.query(devisSql, (err, devisResults) => {
    if (err) return res.status(500).json(err);

    db.query(lignesSql, (err, lignesResults) => {
      if (err) return res.status(500).json(err);

      // regrouper les lignes par devis
      const devisWithLignes = devisResults.map(devis => {
        const lignes = lignesResults.filter(
          l => l.devis_id === devis.id
        );

        return {
          ...devis,
          lignes
        };
      });

      res.json(devisWithLignes);
    });
  });
});

router.get("/status", (req, res) => {
  sql = "SELECT * FROM devis_status"
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
     res.json(results);
  })
})

// GET devis by ID
router.get("/:devisId", (req, res) => {
  const { devisId } = req.params;

  const sql = `
         SELECT 
    devis.*, 
    devis_status.name AS status_name
    FROM devis
    LEFT JOIN devis_status ON devis.status_id = devis_status.id
    WHERE devis.id = ?
  `;

  db.query(sql, [devisId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "devis not found" });
    }
    res.json(results[0]);
  });
});

module.exports = router;