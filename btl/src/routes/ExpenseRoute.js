const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/ExpenseController')

router.post('/create-expense', ExpenseController.createExpense) 
router.put('/update-expense/:id', ExpenseController.updateExpense) 
router.delete('/delete-expense/:id', ExpenseController.deleteExpense) 
router.get('/details/:id', ExpenseController.getDetailExpense) 
router.get('/get-all', ExpenseController.getAllExpense) 


module.exports = router