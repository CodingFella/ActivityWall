const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World! This is my Node.js backend.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
