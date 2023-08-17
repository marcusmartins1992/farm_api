const express = require('express');
const router = express.Router();
const { validateCreateFarm, validateUpdateFarm } = require('../validators/FarmValidator');
const { validationResult } = require('express-validator');
const Farm = require('../models/Farm'); // Importe o modelo de dados da fazenda
const TokenController = require('./TokenController');


// Create: Cadastrar uma nova fazenda
router.post('/', TokenController.authenticateToken, validateCreateFarm, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try {
    const farmData = req.body;
    const farm = new Farm(farmData);
    await farm.save();
    res.json({ message: 'Fazenda cadastrada com sucesso', farm });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar a fazenda' });
  }
});

// Read: Consultar uma fazenda por ID
router.get('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (farm) {
      res.json(farm);
    } else {
      res.status(404).json({ error: 'Fazenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar a fazenda' });
  }
});

// Update: Atualizar dados de uma fazenda
router.put('/:id', TokenController.authenticateToken, validateUpdateFarm, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (farm) {
      res.json({ message: 'Fazenda atualizada com sucesso', farm });
    } else {
      res.status(404).json({ error: 'Fazenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a fazenda' });
  }
});

// Delete: Remover uma fazenda
router.delete('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (farm) {
      res.json({ message: 'Fazenda removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Fazenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover a fazenda' });
  }
});

module.exports = router;
