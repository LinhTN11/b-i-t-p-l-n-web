const express = require('express');
const router = express.Router();
const { createUser, loginUser, logoutUser, updateUser, updateUserProfile, getDetailsUser } = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);

// User management routes
router.put('/update-user/:id', authMiddleware, updateUser);
router.put('/update-profile/:id', authMiddleware, updateUserProfile);
router.get('/details-user/:id', authMiddleware, getDetailsUser);

module.exports = router;