const express = require('express');
const router = express.Router();
const db = require('../database/db');

// normalize priority value
const normalizePriority = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.trunc(parsed);
};

//get all rules
router.get('/', (req, res) => {
  db.all("SELECT * FROM rules ORDER BY priority DESC, id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch rules', error: err.message });
    res.json(rows);
  });
});


// Create a  rule
router.post('/', (req, res) => {
  const { keyword, matchType, actionType, color, label, isActive, priority: rawPriority } = req.body;

  if (!keyword || !String(keyword).trim()) {
    return res.status(400).json({ message: 'keyword is required' });
  }

  const priority = normalizePriority(rawPriority);
  if (priority === null) {
    return res.status(400).json({ message: 'priority must be a number' });
  }

  const query = `
    INSERT INTO rules (keyword, matchType, actionType, color, label, isActive, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const activeValue = typeof isActive === 'number' ? (isActive ? 1 : 0) : 1;

  db.run(query, [keyword, matchType, actionType, color || null, label || null, activeValue, priority], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to create rule', error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});


// Update a rule
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { keyword, matchType, actionType, color, label, priority: rawPriority } = req.body;

  if (!id) return res.status(400).json({ message: 'id is required' });
  if (!keyword || !String(keyword).trim()) {
    return res.status(400).json({ message: 'keyword is required' });
  }

  const priority = normalizePriority(rawPriority);
  if (priority === null) {
    return res.status(400).json({ message: 'priority must be a number' });
  }

  const query = `
    UPDATE rules
    SET keyword = ?, matchType = ?, actionType = ?, color = ?, label = ?, priority = ?
    WHERE id = ?
  `;

  db.run(query, [keyword, matchType, actionType, color || null, label || null, priority, id], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to update rule', error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Rule not found' });
    res.json({ updated: true });
  });
});


// Delete a rule
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'id is required' });

  db.run('DELETE FROM rules WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete rule', error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Rule not found' });
    res.json({ deleted: true });
  });
});


// Toggle isActive
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'id is required' });

  db.run(
    'UPDATE rules SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to toggle rule', error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: 'Rule not found' });

      db.all('SELECT id, isActive FROM rules WHERE id = ?', [id], (readErr, rows) => {
        if (readErr) return res.status(500).json({ message: 'Toggled but failed to read rule', error: readErr.message });
        res.json(rows && rows[0] ? rows[0] : { id: Number(id) });
      });
    }
  );
});


// process text with rules
router.post('/process-text', (req, res) => {
  const { text } = req.body;

  if (!text) return res.json({ result: [] });

  db.all(
    "SELECT * FROM rules WHERE isActive = 1 OR isActive IS NULL",
    [],
    (err, rules) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to process text",
          error: err.message
        });
      }

      //   SORT (priority + keyword length)
      rules.sort((a, b) => {
        const pa = a.priority || 0;
        const pb = b.priority || 0;

        if (pb !== pa) return pb - pa;

        return (b.keyword?.length || 0) - (a.keyword?.length || 0);
      });

      const words = text.split(/\s+/);

      const result = words.map((word) => {
        let styledWord = {
          text: word,
          color: null,
          tooltip: null
        };

        const lowerWord = word.toLowerCase();
        const cleanWord = lowerWord.replace(/[^\w]/g, "");

        let bestHighlight = null;
        let bestTooltip = null;

        for (const rule of rules) {
          const { keyword, matchType, actionType } = rule;

          if (!keyword) continue;

          const lowerKeyword = keyword.toLowerCase();

          let match = false;

          if (matchType === "contains") {
            match = cleanWord.includes(lowerKeyword);
          } else if (matchType === "startsWith") {
            match = cleanWord.startsWith(lowerKeyword);
          } else if (matchType === "exact") {
            match = cleanWord === lowerKeyword;
          }

          if (!match) continue;

          if (actionType === "highlight" && !bestHighlight) {
            bestHighlight = rule;
          }

          if (actionType === "tooltip" && !bestTooltip) {
            bestTooltip = rule;
          }

          // If we have both a highlight and tooltip, we can stop checking further rules
          if (bestHighlight && bestTooltip) break;
        }

        if (bestHighlight) {
          styledWord.color = bestHighlight.color || "yellow";
        }

        if (bestTooltip) {
          styledWord.tooltip = bestTooltip.label || "IMPORTANT";
        }

        return styledWord;
      });

      res.json({ result });
    }
  );
});
module.exports = router;