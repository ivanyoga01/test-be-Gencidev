const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const JWTUtils = require('../utils/jwt');

class AuthService {
  static async registerUser(userData) {
    const { name, email, password } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    return user;
  }
  
  static async loginUser(credentials) {
    const { email, password } = credentials;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = JWTUtils.generateToken({
      userId: user.id,
      email: user.email,
    });
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

module.exports = AuthService;