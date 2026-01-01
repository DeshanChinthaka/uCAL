const Calculation = require("../models/Calculation");

exports.calculate = async (req, res) => {
  try {
    const { num1, num2, operation } = req.body;

    // Basic validation
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ message: "Invalid numbers" });
    }

    let result;

    switch (operation) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        if (num2 === 0) {
          return res.status(400).json({ message: "Division by zero" });
        }
        result = num1 / num2;
        break;
      default:
        return res.status(400).json({ message: "Invalid operation" });
    }

    const calculation = new Calculation({
      num1,
      num2,
      operation,
      result
    });

    await calculation.save();

    res.json(calculation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(20); // Optional: limit to recent 20
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await Calculation.deleteMany({});  // Deletes all calculations
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing history" });
  }
};