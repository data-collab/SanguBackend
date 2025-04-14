const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: String },
  budgets: [
    {
      name: String,
      budget: Number,
      usedAmount: Number,
      balanceLeft: Number
    }
  ]
});

module.exports = mongoose.model("Budget", budgetSchema);
