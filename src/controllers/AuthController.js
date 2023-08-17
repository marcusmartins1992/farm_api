const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenController = require('./TokenController');


// Rota para realizar login e obter tokens
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const { accessToken, refreshToken } = TokenController.generateTokens(user._id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar a autenticação' });
  }
});

// Rota para gerar um novo token de acesso usando o refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verificar o refresh token
    jwt.verify(refreshToken, process.env.SECRET_REFRESH, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token inválido' });
      }

      // Gerar um novo token de acesso usando o ID do usuário do refresh token
      const { userId } = decoded;
      const { accessToken } = TokenController.generateTokens(userId);

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar novo token de acesso' });
    console.log(error);
  }
});

module.exports = router;