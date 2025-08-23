const JWTUtils = require('../utils/jwt');
const prisma = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);
    
    const decoded = JWTUtils.verifyToken(token);
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
};