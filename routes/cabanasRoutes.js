const express = require('express');
const router = express.Router();
const cabanasController = require('../controllers/cabanasController');
const { auth, restrictToAdmin } = require('../middlewares/auth');
const { validarCabana, validarId } = require('../middlewares/validators');
const { validarDisponibilidad } = require('../middlewares/validators');

// Rutas públicas
router.get('/', cabanasController.obtenerCabanas);
router.get('/destacadas', cabanasController.obtenerCabanasDestacadas);
router.get('/disponibles', validarDisponibilidad, cabanasController.obtenerCabanasDisponibles);
router.get('/:id', validarId, cabanasController.obtenerCabana);

// Rutas protegidas (requieren autenticación y ser admin)
router.use(auth, restrictToAdmin);

router.post('/', validarCabana, cabanasController.crearCabana);
router.patch('/:id', validarId, validarCabana, cabanasController.actualizarCabana);
router.delete('/:id', validarId, cabanasController.eliminarCabana);

module.exports = router;