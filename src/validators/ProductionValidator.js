const { body, validationResult } = require('express-validator');

// Validação para cadastrar uma nova produção de leite
exports.validateCreateProduction = [
  body('codigo_fazenda').notEmpty().withMessage('O código da fazenda é obrigatório'),
  body('data').notEmpty().withMessage('A data é obrigatória').isDate().withMessage('Data inválida'),
  body('volume_litros').notEmpty().withMessage('O volume em litros é obrigatório').isNumeric().withMessage('Volume deve ser um número')
];

// Validação para atualizar dados de uma produção de leite
exports.validateUpdateProduction = [
  body('data').notEmpty().withMessage('A data é obrigatória').isDate().withMessage('Data inválida'),
  body('volume_litros').notEmpty().withMessage('O volume em litros é obrigatório').isNumeric().withMessage('Volume deve ser um número')
];
