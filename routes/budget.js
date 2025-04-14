const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Budget = require("../models/budget");

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    console.log("✅ Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    const userId = new mongoose.Types.ObjectId(decoded.id);
    console.log("✅ Converted userId:", userId);

    // DEBUG: Log all budgets
    const allBudgets = await Budget.find({});
    console.log("📦 All budgets in DB:", allBudgets);

    // 🔍 Manual JS matching
    const manual = allBudgets.find(b => b.userId.toString() === userId.toString());
    console.log("🔍 Manual match:", manual);

    // 🔍 Try regular Mongoose find
    let budget = await Budget.findOne({ userId });
    console.log("🔍 Mongoose findOne result:", budget);

    // ❌ If not found, try $where
    if (!budget) {
      budget = await Budget.findOne({
        $where: function () {
          return this.userId.toString() === userId.toString();
        },
      });
      console.log("🔍 $where result:", budget);
    }

    // ❌ If still not found, try $expr
    if (!budget) {
      budget = await Budget.findOne({
        $expr: { $eq: ["$userId", userId] },
      });
      console.log("🔍 $expr result:", budget);
    }

    // ❌ If still not found, try aggregate
    if (!budget) {
      const result = await Budget.aggregate([
        { $match: { userId: userId } },
        { $limit: 1 },
      ]);
      budget = result[0];
      console.log("🔍 Aggregation result:", budget);
    }

    // Final check
    if (!budget) {
      console.log("❌ Budget not found for userId:", userId);
      return res.status(404).json({ message: "Budget not found" });
    }

    console.log("✅ Budget found:", budget);
    res.status(200).json(budget);
  } catch (err) {
    console.error("❌ Error fetching budget:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
