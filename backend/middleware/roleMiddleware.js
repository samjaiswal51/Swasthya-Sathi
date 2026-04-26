// Role-based access middleware
// Usage: roleMiddleware('admin') or roleMiddleware('admin', 'doctor')
module.exports = function (...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
