const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = user;
    next(); 
  });
};

exports.ifAdmin = (req, res, next) =>{

    if (req.user.role !== 'admin'){
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
};
