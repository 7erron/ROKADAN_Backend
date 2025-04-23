const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarServicio, validarId } = require('../middlewares/validators');

// Verificar que las funciones en el controlador estén exportadas correctamente
if (typeof serviciosController.obtenerServicios !== 'function' ||
    typeof serviciosController.crearServicio !== 'function' ||
    typeof serviciosController.obtenerServicio !== 'function' ||
    typeof serviciosController.actualizarServicio !== 'function' ||
    typeof serviciosController.eliminarServicio !== 'function') {
    throw new Error("Algunas funciones del controlador de servicios no están definidas correctamente.");
}

// Rutas para servicios
router.route('/')
  .get(serviciosController.obtenerServicios) // Asegúrate de que esta función esté exportada correctamente
  .post(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarServicio, // Valida los datos del servicio
    serviciosController.crearServicio // Función que crea un servicio
  );

router.route('/:id')
  .get(validarId, serviciosController.obtenerServicio) // Validación de ID y obtener servicio por ID
  .patch(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarId, // Valida el ID del servicio
    validarServicio, // Valida los datos del servicio
    serviciosController.actualizarServicio // Función que actualiza un servicio
  )
  .delete(
    verificarToken, // Verifica el token para la autenticación
    verificarRol('admin'), // Verifica que el rol sea 'admin'
    validarId, // Valida el ID del servicio
    serviciosController.eliminarServicio // Función que elimina un servicio
  );

module.exports = router;
