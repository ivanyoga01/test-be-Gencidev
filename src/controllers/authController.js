const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.registerUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req, res, next) {
    try {
      const result = await AuthService.loginUser(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async logout(req, res, next) {
    try {
      // For JWT, logout is handled on client side by removing token
      // In a more complex system, you might maintain a blacklist of tokens
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getProfile(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user: req.user },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;