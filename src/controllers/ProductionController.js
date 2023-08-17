const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Production = require('../models/production'); // Importe o modelo de dados da produção
const Farm = require('../models/Farm');
const TokenController = require('./TokenController');

// Validações
const { validateCreateProduction, validateUpdateProduction } = require('../validators/productionValidator');

// Função para calcular o preço da produção de leite
function calculatePrice(volume_litros, distancia_km, data) {
  const semestre = data.getMonth() < 6 ? 1 : 2;
  const precoBase = semestre === 1 ? 1.8 : 1.95;
  const custoKm = distancia_km <= 50 ? 0.05 : 0.06;
  const bonus = volume_litros > 10000 ? 0.01 : 0;

  const preco = (volume_litros * precoBase) - (custoKm * distancia_km) + (bonus * volume_litros);
  return preco;
}

// Create: Cadastrar uma nova produção de leite
router.post('/', TokenController.authenticateToken, validateCreateProduction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productionData = req.body;
    const production = new Production(productionData);

    // Cálculo do preço e atualização na produção
    const farm = await Farm.findById(productionData.codigo_fazenda);
    const preco = calculatePrice(productionData.volume_litros, farm.distancia_km, productionData.data);
    production.preco = preco;

    await production.save();

    res.json({ message: 'Produção de leite cadastrada com sucesso', production });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar a produção de leite' });
  }
});

// Read: Consultar produções de leite por código de fazenda e data
router.get('/', TokenController.authenticateToken, async (req, res) => {
  try {
    const { codigo_fazenda, data } = req.query;
    const query = { codigo_fazenda };
    if (data) {
      query.data = data;
    }

    const productions = await Production.find(query);
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar as produções de leite' });
  }
});

// Update: Atualizar dados de uma produção de leite
router.put('/:id', TokenController.authenticateToken, validateUpdateProduction, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const production = await Production.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (production) {
      res.json({ message: 'Produção de leite atualizada com sucesso', production });
    } else {
      res.status(404).json({ error: 'Produção de leite não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a produção de leite' });
  }
});

// Delete: Remover uma produção de leite
router.delete('/:id', TokenController.authenticateToken, async (req, res) => {
  try {
    const production = await Production.findByIdAndDelete(req.params.id);
    if (production) {
      res.json({ message: 'Produção de leite removida com sucesso' });
    } else {
      res.status(404).json({ error: 'Produção de leite não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover a produção de leite' });
  }
});

// Consulta de volume de leite entregue por fazenda, mês e ano
router.get('/volume', TokenController.authenticateToken, async (req, res) => {
  const { codigo_fazenda, mes, ano } = req.query;
  try {
    
    const startDate = new Date(ano, mes - 1, 1);
    const endDate = new Date(ano, mes, 0);

    const productions = await Production.find({
      codigo_fazenda,
      data: { $gte: startDate, $lte: endDate }
    });

    const dailyVolumes = {};
    productions.forEach(prod => {
      const day = prod.data.getDate();
      dailyVolumes[day] = (dailyVolumes[day] || 0) + prod.volume_litros;
    });

    const totalVolume = productions.reduce((acc, prod) => acc + prod.volume_litros, 0);
    const averageVolume = totalVolume / Object.keys(dailyVolumes).length;

    res.json({ dailyVolumes, totalVolume, averageVolume });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar o volume de leite' });
  }
});

// Consulta de preço do leite por fazenda e mês
router.get('/preco', TokenController.authenticateToken, async (req, res) => {
  try {
    const { codigo_fazenda, mes, ano } = req.query;
    const startDate = new Date(ano, mes - 1, 1);
    const endDate = new Date(ano, mes, 0);

    const productions = await Production.find({
      codigo_fazenda,
      data: { $gte: startDate, $lte: endDate }
    });

    const farm = await Farm.findById(codigo_fazenda);
    if (!farm) {
      return res.status(404).json({ error: 'Fazenda não encontrada' });
    }

    const totalPreco = productions.reduce((acc, prod) => acc + prod.preco, 0);

    // Formatação do preço no formato numérico brasileiro e inglês
    const formattedTotalPrecoBR = totalPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedTotalPrecoEN = totalPreco.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    res.json({ formattedTotalPrecoBR, formattedTotalPrecoEN });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar o preço do leite' });
  }
});

// Consulta de preço do leite por fazenda e ano
router.get('/preco-por-ano', TokenController.authenticateToken, async (req, res) => {
  try {
    const { codigo_fazenda, ano } = req.query;

    const startDate = new Date(ano, 0, 1); // Primeiro dia do ano
    const endDate = new Date(ano, 11, 31); // Último dia do ano

    const productions = await Production.find({
      codigo_fazenda,
      data: { $gte: startDate, $lte: endDate }
    });

    const farm = await Farm.findById(codigo_fazenda);
    if (!farm) {
      return res.status(404).json({ error: 'Fazenda não encontrada' });
    }

    const monthlyPrices = Array(12).fill(0);

    productions.forEach(prod => {
      const month = prod.data.getMonth();
      monthlyPrices[month] += prod.preco;
    });

    // Formatação dos preços no formato numérico brasileiro e inglês
    const formattedMonthlyPricesBR = monthlyPrices.map(price =>
      price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    );

    const formattedMonthlyPricesEN = monthlyPrices.map(price =>
      price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    );

    res.json({ formattedMonthlyPricesBR, formattedMonthlyPricesEN });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar os preços do leite por ano' });
  }
});

module.exports = router;
