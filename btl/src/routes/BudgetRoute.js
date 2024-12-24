const express = require('express');
const router = express.Router();
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');

// @route   GET api/budgets
// @desc    Get all budgets
// @access  Private
router.route('/')
  .get(getBudgets)
  .post(createBudget);

// @route   POST api/budgets
// @desc    Create a budget
// @access  Private

// @route   PUT api/budgets/:id
// @desc    Update a budget
// @access  Private
router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

// @route   DELETE api/budgets/:id
// @desc    Delete a budget
// @access  Private

module.exports = router;
