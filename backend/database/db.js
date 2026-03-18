const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./rules.db');

// Initialize database and perform migrations
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT,
      matchType TEXT,
      actionType TEXT,
      color TEXT,
      label TEXT,
      isActive INTEGER DEFAULT 1,
      priority INTEGER DEFAULT 0
    )
  `);

  //check schema 
  db.all("PRAGMA table_info(rules)", [], (err, columns) => {
    if (err) {
      console.error("Failed to read rules schema:", err);
      return;
    }

    const hasIsActive = columns.some(c => c.name === "isActive");
    const hasPriority = columns.some(c => c.name === "priority");

    // Add missing columns if needed
    if (!hasIsActive) {
      db.run("ALTER TABLE rules ADD COLUMN isActive INTEGER DEFAULT 1", (alterErr) => {
        if (alterErr) {
          console.error("Migration failed:", alterErr);
          return;
        }
        
        db.run("UPDATE rules SET isActive = 1 WHERE isActive IS NULL");
      });
    }

    // Add priority column if missing
    if (!hasPriority) {
      db.run("ALTER TABLE rules ADD COLUMN priority INTEGER DEFAULT 0", (alterErr) => {
        if (alterErr) {
          console.error("Failed to add priority column:", alterErr);
          return;
        }

        db.run("UPDATE rules SET priority = 0 WHERE priority IS NULL");
      });
    }
  });
});

module.exports = db;