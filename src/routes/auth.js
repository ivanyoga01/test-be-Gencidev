const express = require('express');
const AuthController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { userRegistrationSchema, userLoginSchema } = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRequest(userRegistrationSchema), AuthController.register);
router.post('/login', validateRequest(userLoginSchema), AuthController.login);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;