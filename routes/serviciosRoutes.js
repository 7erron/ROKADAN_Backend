const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Rutas para servicios
router.route('/')
  .get(serviciosController.obtenerServicios) // Correctamente asignamos el controlador
  .post(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarServicio, // Valida los datos del servicio
    serviciosController.crearServicio // Asigna la función que crea un servicio
  );

router.route('/:id')
  .get(validarId, serviciosController.obtenerServicio) // Validación de ID y obtener servicio por ID
  .patch(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarId, // Valida el ID del servicio
    validarServicio, // Valida los datos del servicio
    serviciosController.actualizarServicio // Asigna la función que actualiza un servicio
  )
  .delete(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarId, // Valida el ID del servicio
    serviciosController.eliminarServicio // Asigna la función que elimina un servicio
  );

module.exports = router;
