const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database (Creates if not exists)
const db = new sqlite3.Database("./users.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to SQLite database ✅");
});

// Create users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`,
  (err) => {
    if (err) console.error("Error creating table:", err);
  }
);

module.exports = db;
