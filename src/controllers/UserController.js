const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const UserValidator = require('../validators/UserValidator');
const TokenController = require('./TokenController');

// Create: Registrar um novo usuário
router.post('/register', UserValidator.registerValidation, async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const newUser = user.toObject();
    delete newUser.password;

    res.json({ message: 'Usuário registrado com sucesso', newUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o usuário' });
  }
});

// Read: Consultar informações de um usuário por ID
router.get('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar o usuário' });
  }
});

// Update: Atualizar informações de um usuário por ID
router.put('/:id', TokenController.authenticateToken, UserValidator.updateValidation, async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword },
      { new: true }
    );

    if (updatedUser) {

      const user = updatedUser.toObject();
      delete user.password;

      res.json({ message: 'Usuário atualizado com sucesso', user });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário' });
  }
});

// Delete: Remover um usuário por ID
router.delete('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: 'Usuário removido com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o usuário' });
  }
});

module.exports = router;