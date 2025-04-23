const express = require('express');
const router = express.Router();
const {
  obtenerCabanas,
  obtenerCabana,
  obtenerCabanasDestacadas,
  obtenerCabanasDisponibles,
  crearCabana,
  actualizarCabana,
  eliminarCabana
} = require('../controllers/cabanasController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarId } = require('../middlewares/validators');

// Middleware para compatibilidad con frontend legacy (si es necesario)
const detectLegacyFrontend = (req, res, next) => {
  req.isLegacyRequest = (
    req.get('Accept') === 'application/json' && 
    !req.get('Content-Type') && 
    !req.query.legacy &&
    !req.headers['x-requested-with']
  );
  next();
};

router.use(detectLegacyFrontend);

// Rutas públicas
router.get('/destacadas', obtenerCabanasDestacadas);  // Obtener cabañas destacadas
router.get('/', obtenerCabanas);  // Obtener todas las cabañas
router.get('/disponibles', obtenerCabanasDisponibles);  // Obtener cabañas disponibles
router.get('/:id', validarId, obtenerCabana);  // Obtener cabaña por ID

// Rutas protegidas para admin
router.post('/', verificarToken, verificarRol('admin'), crearCabana);  // Crear una nueva cabaña
router.patch('/:id', verificarToken, verificarRol('admin'), validarId, actualizarCabana);  // Actualizar cabaña
router.delete('/:id', verificarToken, verificarRol('admin'), validarId, eliminarCabana);  // Eliminar cabaña

module.exports = router;