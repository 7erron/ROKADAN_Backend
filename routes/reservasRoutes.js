const express = require('express');
const router = express.Router();

const reservasController = require('../controllers/reservasController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarReserva, validarId } = require('../middlewares/validators');

// Middleware global de autenticación
router.use(verificarToken);

// Rutas para reservas
router
  .route('/')
  .get(reservasController.obtenerReservas)
  .post(validarReserva, reservasController.crearReserva);

router
  .route('/:id')
  .get(validarId, reservasController.obtenerReserva);

router
  .route('/:id/cancelar')
  .patch(validarId, reservasController.cancelarReserva);

// Ruta protegida solo para admin
router
  .route('/admin')
  .get(verificarRol('admin'), reservasController.funcionSoloParaAdmin);

module.exports = router;
