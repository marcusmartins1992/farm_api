const jwt = require('jsonwebtoken');

// Middleware para verificar o token de acesso
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não fornecido' });
  }

  jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token de acesso inválido' });
    }
    req.user = user;
    next();
  });
};

// Gere um novo token de acesso e refresh token
exports.generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.SECRET_JWT, { expiresIn: '15m' }); // Token de acesso expira em 15 minutos
  const refreshToken = jwt.sign({ userId }, process.env.SECRET_REFRESH, { expiresIn: '7d' }); // Refresh token expira em 7 dias

  return { accessToken, refreshToken };
};

