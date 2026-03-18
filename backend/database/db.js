const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./rules.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT,
      matchType TEXT,
      actionType TEXT,
      color TEXT,
      label TEXT,
      isActive INTEGER DEFAULT 1
    )
  `);

  db.all("PRAGMA table_info(rules)", [], (err, columns) => {
    if (err) {
      console.error("Failed to read rules schema:", err);
      return;
    }

    const hasIsActive = columns.some(c => c.name === "isActive");

    if (!hasIsActive) {
      db.run("ALTER TABLE rules ADD COLUMN isActive INTEGER DEFAULT 1", (alterErr) => {
        if (alterErr) {
          console.error("Migration failed:", alterErr);
          return;
        }

        console.log("Added isActive column");

        //  FIX 
        db.run("UPDATE rules SET isActive = 1 WHERE isActive IS NULL");
      });
    }
  });
});

module.exports = db;