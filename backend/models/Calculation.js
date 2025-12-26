const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema({
  num1: { type: Number, required: true },
  num2: { type: Number, required: true },
  operation: { type: String, required: true },
  result: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Calculation", calculationSchema);