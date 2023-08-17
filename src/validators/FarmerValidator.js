const { body, validationResult } = require('express-validator');

// Validação para cadastrar um novo fazendeiro
exports.validateCreateFarmer = [
  body('name').notEmpty().withMessage('O nome é obrigatório'),
  body('email').notEmpty().withMessage('O email é obrigatório').isEmail().withMessage('Email inválido'),
  body('idFarm').notEmpty().withMessage('A ID da fazenda é obrigatória')
];

// Validação para atualizar dados de um fazendeiro
exports.validateUpdateFarmer = [
  body('name').notEmpty().withMessage('O nome é obrigatório'),
  body('email').notEmpty().withMessage('O email é obrigatório').isEmail().withMessage('Email inválido')
];