const express = require('express');
const router = express.Router();
const { validateCreateFarmer, validateUpdateFarmer } = require('../validators/FarmerValidator');
const { validationResult } = require('express-validator');
const Farmer = require('../models/Farmer'); // Importe o modelo de dados do fazendeiro
const TokenController = require('./TokenController');

// Create: Cadastrar um novo fazendeiro
router.post('/', TokenController.authenticateToken, validateCreateFarmer, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const farmerData = req.body;
    const farmer = new Farmer(farmerData);
    await farmer.save();
    res.json({ message: 'Fazendeiro cadastrado com sucesso', farmer });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar o fazendeiro' });
  }
});

// Read: Consultar um fazendeiro por ID
router.get('/:id', TokenController.authenticateToken, async (req, res) => {

   try {
    const farmer = await Farmer.findById(req.params.id);
    if (farmer) {
      res.json(farmer);
    } else {
      res.status(404).json({ error: 'Fazendeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar o fazendeiro' });
  }
});

// Update: Atualizar dados de um fazendeiro
router.put('/:id', TokenController.authenticateToken, validateUpdateFarmer, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (farmer) {
      res.json({ message: 'Fazendeiro atualizado com sucesso', farmer });
    } else {
      res.status(404).json({ error: 'Fazendeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o fazendeiro' });
  }
});

// Delete: Remover um fazendeiro
router.delete('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (farmer) {
      res.json({ message: 'Fazendeiro removido com sucesso' });
    } else {
      res.status(404).json({ error: 'Fazendeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o fazendeiro' });
  }
});

module.exports = router;
