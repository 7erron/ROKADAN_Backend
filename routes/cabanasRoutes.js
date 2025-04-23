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

// Middleware para compatibilidad
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
router.get('/destacadas', obtenerCabanasDestacadas);
router.get('/', obtenerCabanas);
router.get('/disponibles', obtenerCabanasDisponibles);
router.get('/:id', validarId, obtenerCabana);

// Rutas protegidas (admin)
router.post('/', verificarToken, verificarRol('admin'), crearCabana);
router.patch('/:id', verificarToken, verificarRol('admin'), validarId, actualizarCabana);
router.delete('/:id', verificarToken, verificarRol('admin'), validarId, eliminarCabana);

module.exports = router;