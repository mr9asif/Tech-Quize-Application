import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const jwt_Secret = 'your jwt token'; // ideally use process.env.JWT_SECRET

export default async function authMiddleware(req, res, next) {
  // normalize to string to be safe
  const authHeader = (req.headers.authorization || "").toString();

  // Check format: "Bearer <token>"
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no or invalid Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    const payload = jwt.verify(token, jwt_Secret);
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('jwt verify err', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    });
  }
}
