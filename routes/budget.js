const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Budget = require("../models/Budget");

// ✅ GET Budgets for Logged-In User
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error("❌ Error fetching budget:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ POST New Budget for User
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, budget, usedAmount } = req.body;
    const balanceLeft = budget - usedAmount;

    const newBudgetItem = { name, budget, usedAmount, balanceLeft };

    let userBudget = await Budget.findOne({ userId });

    if (userBudget) {
      // Push new item to existing array
      userBudget.budgets.push(newBudgetItem);
      await userBudget.save();
      res.status(200).json({ message: "Budget updated", data: newBudgetItem });
    } else {
      // Create new budget record for user
      userBudget = new Budget({
        userId,
        budgets: [newBudgetItem],
      });
      await userBudget.save();
      res.status(201).json({ message: "Budget created", data: newBudgetItem });
    }
  } catch (err) {
    console.error("❌ Error creating budget:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
