const { body } = require('express-validator');

// Validação para o registro de um novo usuário
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
  body('email').trim().isEmail().withMessage('O email é inválido'),
  body('password').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
];

// Validação para a atualização de um usuário
exports.updateValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
  body('email').trim().isEmail().withMessage('O email é inválido'),
  body('password').trim().isLength({ min: 6 }).optional().withMessage('A senha deve ter pelo menos 6 caracteres')
];
