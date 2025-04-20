const { body, param, query } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.validarRegistro = [
  // Nombre
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
  
  // Apellido
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ max: 50 }).withMessage('El apellido no puede exceder los 50 caracteres'),
  
  // Email
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail()
    .custom(async (email) => {
      const usuario = await Usuario.findByEmail(email);
      if (usuario) {
        throw new Error('El email ya está registrado');
      }
      return true;
    }),
  
  // Teléfono
  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es requerido')
    .isLength({ min: 8, max: 15 }).withMessage('El teléfono debe tener entre 8 y 15 caracteres')
    .matches(/^[0-9]+$/).withMessage('El teléfono solo puede contener números'),
  
  // Password
  body('password')
    .trim()
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[\W_]/).withMessage('La contraseña debe contener al menos un carácter especial'),
    
  // Confirm Password
  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('Debes confirmar la contraseña')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
];

exports.validarLogin = [
  // Email
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  // Password
  body('password')
    .trim()
    .notEmpty().withMessage('La contraseña es requerida')
];

exports.validarCabana = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
  body('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0')
    .toFloat(),
  body('capacidad')
    .isInt({ gt: 0 }).withMessage('La capacidad debe ser mayor a 0')
    .toInt(),
  body('imagen')
    .optional()
    .isURL().withMessage('La imagen debe ser una URL válida')
];

exports.validarServicio = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('descripcion').trim().optional(),
  body('precio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
    .toFloat()
];

exports.validarReserva = [
  body('cabana_id')
    .notEmpty().withMessage('El ID de la cabaña es requerido')
    .isInt({ gt: 0 }).withMessage('ID de cabaña inválido')
    .toInt(),
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es requerida')
    .isISO8601().withMessage('Fecha inválida (formato YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error('La fecha de inicio no puede ser en el pasado');
      }
      return true;
    }),
  body('fecha_fin')
    .notEmpty().withMessage('La fecha de fin es requerida')
    .isISO8601().withMessage('Fecha inválida (formato YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  body('adultos')
    .notEmpty().withMessage('El número de adultos es requerido')
    .isInt({ gt: 0 }).withMessage('Debe haber al menos 1 adulto')
    .toInt(),
  body('ninos')
    .optional()
    .isInt({ min: 0 }).withMessage('El número de niños no puede ser negativo')
    .toInt(),
  body('servicios')
    .optional()
    .isArray().withMessage('Los servicios deben ser un array de IDs')
];

exports.validarId = [
  param('id')
    .notEmpty().withMessage('El ID es requerido')
    .isInt({ gt: 0 }).withMessage('ID inválido')
    .toInt()
];

exports.validarDisponibilidad = [
  query('fechaInicio')
    .notEmpty().withMessage('La fecha de inicio es requerida')
    .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error('La fecha de inicio no puede ser en el pasado');
      }
      return true;
    }),
  query('fechaFin')
    .notEmpty().withMessage('La fecha de fin es requerida')
    .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.query.fechaInicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  query('adultos')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 adulto')
    .toInt(),
  query('ninos')
    .optional()
    .isInt({ min: 0 }).withMessage('El número de niños no puede ser negativo')
    .toInt()
];