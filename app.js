const express = require("express");
const fs = require("fs");
const app = express();

const version = fs.readFileSync("version.txt", "utf8").trim();

app.use(express.static("public"));

app.get("/version", (req, res) => {
  res.json({ version: version });
});

app.listen(3000, () => console.log("Server running on port 3000"));
