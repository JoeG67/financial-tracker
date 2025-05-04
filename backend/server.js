require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Use dotenv

// 🔹 Register a new user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
    if (err) return res.status(400).json({ error: "User already exists" });
    res.status(201).json({ message: "User registered successfully" });
  });
});

// 🔹 Login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) return res.status(400).json({ error: "All fields required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Create a JWT token with the user's ID and email
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    console.log("Sending response with token and email:", { token, email: user.email });

    // Send token and email back in the response
    res.json({ token, email: user.email });
  });
});

// 🔹 Get user information (email, etc.)
app.get("/user", (req, res) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  
  if (!token) return res.status(401).json({ error: "No token provided" });

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    // Fetch user data from DB using decoded user id
    db.get("SELECT email FROM users WHERE id = ?", [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: "User not found" });

      // Send back the user email (or other data)
      res.json({ email: user.email });
    });
  });
});

app.get("/api/user-budget/:email", async (req, res) => {
  const email = req.params.email;

  const query = `
    SELECT initial_balance, phone_bill, transportation, utilities, entertainment
    FROM users
    WHERE email = ?
  `;

  db.get(query, [email], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!row) return res.status(404).json({ error: "User not found" });
    res.json(row);
  });
});


// 🔹 Start Server
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
