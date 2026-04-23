exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

exports.requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'Please verify your email first' });
  }
  next();
};

exports.requireValidatedOrganization = (req, res, next) => {
  if (req.user.role === 'organization' && !req.user.isValidated) {
    return res.status(403).json({
      message: 'Your organization needs to be validated by an admin'
    });
  }
  next();
};

module.exports = exports;
