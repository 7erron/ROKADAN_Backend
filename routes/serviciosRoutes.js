const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas para servicios públicas y privadas
router.get('/', serviciosController.obtenerServicios); // Obtener todos los servicios disponibles

router.post('/',
  verificarToken,
  verificarRol('admin'),
  validarServicio,
  serviciosController.crearServicio // Crear un nuevo servicio
);

router.get('/:id', validarId, serviciosController.obtenerServicio); // Obtener servicio por ID

router.patch('/:id',
  verificarToken,
  verificarRol('admin'),
  validarId,
  validarServicio,
  serviciosController.actualizarServicio // Actualizar servicio
);

router.delete('/:id',
  verificarToken,
  verificarRol('admin'),
  validarId,
  serviciosController.eliminarServicio // Eliminar servicio
);

module.exports = router;
