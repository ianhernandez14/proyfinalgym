const { body } = require('express-validator');

const validarUsuario = [
  body('email')
    .exists().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email debe ser válido.'),
  body('nombre_completo')
    .exists().withMessage('El nombre completo es obligatorio.')
    .isString().withMessage('El nombre completo debe ser una cadena.')
    .trim().isLength({ min: 1 }).withMessage('El nombre completo no puede estar vacío.'),
  body('password')
    .exists().withMessage('El password es obligatorio.')
    .isString().withMessage('El password debe ser una cadena.')
    .isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres.'),
  body('tipo_usuario')
    .exists().withMessage('El tipo de usuario es obligatorio.')
    .isString().withMessage('El tipo de usuario debe ser una cadena.')
    .isIn(['admin', 'usuario', 'profesor', 'estudiante']).withMessage('El tipo de usuario debe ser: admin, usuario, profesor o estudiante.')
];

module.exports = { validarUsuario };