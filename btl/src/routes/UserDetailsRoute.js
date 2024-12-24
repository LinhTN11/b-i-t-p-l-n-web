const express = require('express');
const router = express.Router();
const UserDetailsController = require('../controllers/UserDetailsController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authMiddleware, UserDetailsController.createUserDetails);
router.put('/update/:id', authMiddleware, UserDetailsController.updateUserDetails);
router.get('/get/:id', authMiddleware, UserDetailsController.getUserDetails);
router.put('/update-financial/:id', authMiddleware, UserDetailsController.updateFinancialInfo);

module.exports = router;
