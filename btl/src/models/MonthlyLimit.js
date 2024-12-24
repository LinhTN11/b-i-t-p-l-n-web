const mongoose = require('mongoose')
const monthlyLimitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    month: { type: Number, required: true }, // 1 for Jan, 2 for Feb, etc.
    year: { type: Number, required: true },
    limit: { type: Number, required: true },
    totalSpent: { type: Number, default: 0 },
  }, 
  {
    timestamps: true 
  }
);
const MonthlyLimit = mongoose.model('MonthlyLimit', monthlyLimitSchema)
module.exports = MonthlyLimit