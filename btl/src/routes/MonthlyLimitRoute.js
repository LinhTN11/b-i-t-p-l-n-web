const express = require('express');
const router = express.Router();
const MonthlyController = require("../controllers/MonthlyLimitController");

router.post('/create-monthlyLimit', MonthlyController.createMonthlyLimit);
router.put('/update-monthlyLimit/:id', MonthlyController.updateMonthlyLimit) 
router.delete('/delete-monthlyLimit/:id', MonthlyController.deleteMonthlyLimit) 
router.get('/details/:id', MonthlyController.getDetailMonthlyLimit) 
router.get('/get-all', MonthlyController.getAllMonthlyLimit) 

module.exports = router