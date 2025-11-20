const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'classora_dev_secret';

module.exports = function authAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    console.error('authAdmin error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
