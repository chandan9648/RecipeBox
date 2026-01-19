const jwt = require('jsonwebtoken');
const userModel = require('../models/auth.model');

// Authenticate via Authorization
async function authenticate(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization || '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user; 
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function authorizeRoles(...roles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
}

module.exports = { authenticate, authorizeRoles };
