const { body, validationResult } = require('express-validator');

// Validação para cadastrar uma nova fazenda
exports.validateCreateFarm = [
  body('nome').notEmpty().withMessage('O nome é obrigatório'),
  body('distancia_km').notEmpty().withMessage('A distância é obrigatória').isNumeric().withMessage('Distância deve ser um número')
];

// Validação para atualizar dados de uma fazenda
exports.validateUpdateFarm = [
  body('nome').notEmpty().withMessage('O nome é obrigatório'),
  body('distancia_km').notEmpty().withMessage('A distância é obrigatória').isNumeric().withMessage('Distância deve ser um número')
];
