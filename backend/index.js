const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs-extra");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const configPath = path.join(__dirname, "config.json");

// Ha nincs config.json → installer oldal
app.get("/api/check-config", (req, res) => {
  if (fs.existsSync(configPath)) {
    res.json({ configured: true });
  } else {
    res.json({ configured: false });
  }
});

// Telepítő POST (SQL config + admin létrehozása)
app.post("/api/install", async (req, res) => {
  const { dbType, host, port, username, password, database, adminUser, adminPass } = req.body;
  try {
    const installer = require("./installer");
    await installer.setupDatabase({ dbType, host, port, username, password, database, adminUser, adminPass });
    fs.writeJsonSync(configPath, { dbType, host, port, username, password, database });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`SafeSQL fut: http://localhost:${port}`);
});
