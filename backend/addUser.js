const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db');
const email = 'test3@example.com';
const password = 'abc123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
    if (err) return console.error('Error inserting user:', err.message);
    console.log(`✅ New user added with ID: ${this.lastID}`);
    db.close();
  });
});
