const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const analyzeRoute = require("./routes/analyze");

app.use("/analyze", analyzeRoute);

const ocrRoute = require("./routes/ocr");

app.use("/ocr", ocrRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});