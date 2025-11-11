const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ensure DB exists
const DB_PATH = path.join(__dirname, "clicks.db");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open database:", err);
  } else {
    console.log("Connected to SQLite DB.");
  }
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS clicks (name TEXT PRIMARY KEY, count INTEGER)", (err) => {
    if (err) console.error("Create table error:", err);
  });
});

// API: increment click
app.post("/click", (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ success: false, error: "Name required" });

  db.get("SELECT count FROM clicks WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    if (row) {
      db.run("UPDATE clicks SET count = count + 1 WHERE name = ?", [name], function(updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ success: false });
        }
        return res.json({ success: true });
      });
    } else {
      db.run("INSERT INTO clicks (name, count) VALUES (?, 1)", [name], function(insertErr) {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ success: false });
        }
        return res.json({ success: true });
      });
    }
  });
});

// API: leaderboard
app.get("/leaderboard", (req, res) => {
  db.all("SELECT name, count FROM clicks ORDER BY count DESC LIMIT 20", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    return res.json(rows || []);
  });
});

// simple health
app.get("/health", (req, res) => res.json({ ok: true }));

// fallback to index for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
