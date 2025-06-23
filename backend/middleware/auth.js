import jwt from 'jsonwebtoken';


import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
