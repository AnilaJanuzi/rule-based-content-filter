const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
  db.all("SELECT * FROM rules ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch rules', error: err.message });
    res.json(rows);
  });
});


router.post('/', (req, res) => {
  const { keyword, matchType, actionType, color, label, isActive } = req.body;

  if (!keyword || !String(keyword).trim()) {
    return res.status(400).json({ message: 'keyword is required' });
  }

  const query = `
    INSERT INTO rules (keyword, matchType, actionType, color, label, isActive)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const activeValue = typeof isActive === 'number' ? (isActive ? 1 : 0) : 1;

  db.run(query, [keyword, matchType, actionType, color || null, label || null, activeValue], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to create rule', error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});


// Update a rule
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { keyword, matchType, actionType, color, label } = req.body;

  if (!id) return res.status(400).json({ message: 'id is required' });
  if (!keyword || !String(keyword).trim()) {
    return res.status(400).json({ message: 'keyword is required' });
  }

  const query = `
    UPDATE rules
    SET keyword = ?, matchType = ?, actionType = ?, color = ?, label = ?
    WHERE id = ?
  `;

  db.run(query, [keyword, matchType, actionType, color || null, label || null, id], function(err) {
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


// Toggle isActive (0/1)
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


router.post('/process-text', (req, res) => {
  const { text } = req.body;

  if (!text) return res.json({ result: [] });

  // active rules. (Treat NULL as active for older rows.)
  db.all("SELECT * FROM rules WHERE isActive = 1 OR isActive IS NULL", [], (err, rules) => {
    if (err) return res.status(500).json({ message: 'Failed to process text', error: err.message });

    const words = text.split(/\s+/);

    const result = words.map(word => {
      let styledWord = {
        text: word,
        color: null,
        tooltip: null
      };

      rules.forEach(rule => {
        const { keyword, matchType, actionType, color, label } = rule;

        if (!keyword) return;

        const lowerWord = word.toLowerCase();
    const cleanWord = lowerWord.replace(/[.,!?]/g, "");
        const lowerKeyword = keyword.toLowerCase();

        let match = false;

        if (matchType === 'contains') {
          match = cleanWord.includes(lowerKeyword);
        } 
        else if (matchType === 'startsWith') {
          match = cleanWord.startsWith(lowerKeyword);
        } 
        else if (matchType === 'exact') {
          match = cleanWord === lowerKeyword;
        }

        if (match) {
          if (actionType === 'highlight') {
            styledWord.color = color || 'yellow';
          }

          if (actionType === 'tooltip') {
            styledWord.tooltip = label || 'IMPORTANT';
          }
        }
      });

      return styledWord;
    });

    res.json({ result });
  });
});
module.exports = router;