const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas para servicios
router.route('/')
  .get(serviciosController.obtenerServicios)
  .post(
    verificarToken,
    verificarRol('admin'),
    validarServicio,
    serviciosController.crearServicio
  );

router.route('/:id')
  .get(validarId, serviciosController.obtenerServicio)
  .patch(
    verificarToken,
    verificarRol('admin'),
    validarId,
    validarServicio,
    serviciosController.actualizarServicio
  )
  .delete(
    verificarToken,
    verificarRol('admin'),
    validarId,
    serviciosController.eliminarServicio
  );

module.exports = router;