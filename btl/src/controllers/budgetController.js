const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Public
const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const budgets = await Budget.find({ user: userId }).sort({ date: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Public
const createBudget = async (req, res) => {
  try {
    const { category, amount, startDate, endDate, note, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
    }

    const budget = new Budget({
      user: userId,
      category,
      amount,
      startDate,
      endDate,
      note
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Public
const updateBudget = async (req, res) => {
  try {
    const { category, amount, startDate, endDate, note, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find budget and check ownership
    const budget = await Budget.findOne({ _id: req.params.id, user: userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    // Validate dates if they are being updated
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
      }
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          category: category || budget.category,
          amount: amount || budget.amount,
          startDate: startDate || budget.startDate,
          endDate: endDate || budget.endDate,
          note: note || budget.note
        }
      },
      { new: true }
    );

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Public
const deleteBudget = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const budget = await Budget.findOne({ _id: req.params.id, user: userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
