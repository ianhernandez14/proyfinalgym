const { body } = require('express-validator');

const validarUsuario = [
  body('id')
    .exists().withMessage('El id es obligatorio.')
    .isNumeric().withMessage('El id debe ser un número.'),
  body('email')
    .exists().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email debe ser válido.'),
  body('nombre_completo')
    .exists().withMessage('El nombre completo es obligatorio.')
    .isString().withMessage('El nombre completo debe ser una cadena.'),
  body('password')
    .exists().withMessage('El password es obligatorio.')
    .isString().withMessage('El password debe ser una cadena.'),
  body('tipo_usuario')
    .exists().withMessage('El tipo de usuario es obligatorio.')
    .isString().withMessage('El tipo de usuario debe ser una cadena.')
];

module.exports = { validarUsuario };