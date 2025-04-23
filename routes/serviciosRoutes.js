const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas para servicios públicas y privadas
router.get('/', serviciosController.obtenerServicios);

router.post('/',
  verificarToken,
  verificarRol('admin'),
  validarServicio,
  serviciosController.crearServicio
);

router.get('/:id', validarId, serviciosController.obtenerServicio);

router.patch('/:id',
  verificarToken,
  verificarRol('admin'),
  validarId,
  validarServicio,
  serviciosController.actualizarServicio
);

router.delete('/:id',
  verificarToken,
  verificarRol('admin'),
  validarId,
  serviciosController.eliminarServicio
);

module.exports = router;
