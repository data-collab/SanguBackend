const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    budgets: [
      {
        name: { type: String, required: true },
        budget: { type: Number, required: true, min: 0 }, // Ensure the budget is not negative
        usedAmount: { type: Number, required: true, min: 0 }, // Ensure the usedAmount is not negative
        balanceLeft: { type: Number, required: true, min: 0 }, // Ensure balanceLeft is not negative
      }
    ]
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("budget", budgetSchema);
