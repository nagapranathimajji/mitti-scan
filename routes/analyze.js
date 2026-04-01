const express = require("express");
const router = express.Router();

const { analyzeSoil } = require("../controllers/analyzeController");

router.post("/", analyzeSoil);

module.exports = router;