const express = require("express");
const router = express.Router();
const { calculate, getHistory } = require("../controllers/calculatorController");

router.post("/", calculate);
router.get("/history", getHistory);

module.exports = router;