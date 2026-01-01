const express = require("express");
const router = express.Router();
const { calculate, getHistory, clearHistory } = require("../controllers/calculatorController");

router.post("/", calculate);
router.get("/history", getHistory);
router.delete("/history", clearHistory);

module.exports = router;