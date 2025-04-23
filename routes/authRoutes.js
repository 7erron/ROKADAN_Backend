const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth'); // Importa directamente el módulo auth
const { validarRegistro, validarLogin } = require('../middlewares/validators');

// @desc    Registrar un nuevo usuario
// @route   POST /registrar
// @access  Public
router.post('/registrar', validarRegistro, authController.registrar);

// @desc    Autenticar usuario
// @route   POST /login
// @access  Public
router.post('/login', validarLogin, authController.login);

// @desc    Obtener información del usuario actual
// @route   GET /me
// @access  Private
router.get('/me', auth.verificarToken, authController.getMe);

// @desc    Solo accesible para administradores
// @route   GET /admin
// @access  Private
router.get('/admin', auth.verificarToken, auth.verificarRol('admin'), (req, res) => {
  res.status(200).json({ message: 'Ruta solo accesible para administradores.' });
});

module.exports = router;